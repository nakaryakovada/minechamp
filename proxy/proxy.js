/**
 * MineChamp Wake-on-Connect Proxy
 * 
 * Este proxy ligero:
 * 1. Escucha conexiones de Minecraft
 * 2. Cuando alguien intenta conectar, enciende el servidor principal
 * 3. Muestra mensaje de "Iniciando servidor..." al jugador
 * 4. Consume muy pocos recursos (~30-50MB RAM)
 */

const net = require('net');
const https = require('https');

// Configuración desde variables de entorno
const CONFIG = {
    // Puerto donde escucha el proxy
    PROXY_PORT: parseInt(process.env.PROXY_PORT || '25565'),
    
    // Railway API
    RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
    RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
    RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
    RAILWAY_ENVIRONMENT_ID: process.env.RAILWAY_ENVIRONMENT_ID || 'production',
    
    // Servidor de Minecraft (interno de Railway)
    MC_SERVER_HOST: process.env.MC_SERVER_HOST || 'localhost',
    MC_SERVER_PORT: parseInt(process.env.MC_SERVER_PORT || '25566'),
    
    // Configuración del proxy
    SERVER_MOTD: process.env.SERVER_MOTD || '§6§lMineChamp §r§7| §eClick para iniciar servidor',
    STARTING_MOTD: process.env.STARTING_MOTD || '§6§lMineChamp §r§7| §aIniciando servidor...',
    COOLDOWN_MINUTES: parseInt(process.env.COOLDOWN_MINUTES || '2'),
};

// Estado del servidor
let serverState = {
    status: 'unknown', // 'unknown', 'stopped', 'starting', 'running'
    lastStartRequest: 0,
    lastCheck: 0,
};

console.log('========================================');
console.log('   MineChamp Wake-on-Connect Proxy');
console.log('========================================');
console.log(`Puerto: ${CONFIG.PROXY_PORT}`);
console.log(`Servidor MC: ${CONFIG.MC_SERVER_HOST}:${CONFIG.MC_SERVER_PORT}`);
console.log('');

/**
 * Verifica si el servidor de Minecraft está corriendo
 */
function checkServerStatus() {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);
        
        socket.on('connect', () => {
            socket.destroy();
            serverState.status = 'running';
            resolve(true);
        });
        
        socket.on('error', () => {
            socket.destroy();
            if (serverState.status !== 'starting') {
                serverState.status = 'stopped';
            }
            resolve(false);
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            if (serverState.status !== 'starting') {
                serverState.status = 'stopped';
            }
            resolve(false);
        });
        
        socket.connect(CONFIG.MC_SERVER_PORT, CONFIG.MC_SERVER_HOST);
    });
}

/**
 * Inicia el servidor de Minecraft via Railway API
 */
async function startMinecraftServer() {
    const now = Date.now();
    const cooldownMs = CONFIG.COOLDOWN_MINUTES * 60 * 1000;
    
    // Evitar múltiples requests en poco tiempo
    if (now - serverState.lastStartRequest < cooldownMs) {
        console.log('[Proxy] Solicitud de inicio ignorada (cooldown activo)');
        return false;
    }
    
    if (!CONFIG.RAILWAY_TOKEN || !CONFIG.RAILWAY_SERVICE_ID) {
        console.log('[Proxy] ERROR: Variables de Railway no configuradas');
        console.log('[Proxy] Necesitas: RAILWAY_TOKEN, RAILWAY_SERVICE_ID');
        return false;
    }
    
    serverState.lastStartRequest = now;
    serverState.status = 'starting';
    
    console.log('[Proxy] Iniciando servidor de Minecraft via Railway API...');
    
    const query = `
        mutation serviceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
            serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
        }
    `;
    
    const variables = {
        serviceId: CONFIG.RAILWAY_SERVICE_ID,
        environmentId: CONFIG.RAILWAY_ENVIRONMENT_ID,
    };
    
    const postData = JSON.stringify({ query, variables });
    
    return new Promise((resolve) => {
        const options = {
            hostname: 'backboard.railway.app',
            port: 443,
            path: '/graphql/v2',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.RAILWAY_TOKEN}`,
                'Content-Length': Buffer.byteLength(postData),
            },
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('[Proxy] ✅ Servidor iniciándose...');
                    resolve(true);
                } else {
                    console.log(`[Proxy] ❌ Error al iniciar: ${res.statusCode}`);
                    console.log(data);
                    serverState.status = 'stopped';
                    resolve(false);
                }
            });
        });
        
        req.on('error', (e) => {
            console.log(`[Proxy] ❌ Error de conexión: ${e.message}`);
            serverState.status = 'stopped';
            resolve(false);
        });
        
        req.write(postData);
        req.end();
    });
}

/**
 * Crea un paquete de respuesta de estado del servidor (Server List Ping)
 */
function createStatusResponse(motd, playersOnline = 0, maxPlayers = 20) {
    const response = {
        version: {
            name: "1.21.11",
            protocol: 768
        },
        players: {
            max: maxPlayers,
            online: playersOnline,
            sample: []
        },
        description: {
            text: motd
        },
        enforcesSecureChat: false,
        previewsChat: false
    };
    
    return JSON.stringify(response);
}

/**
 * Lee un VarInt del buffer
 */
function readVarInt(buffer, offset = 0) {
    let value = 0;
    let length = 0;
    let currentByte;
    
    do {
        if (offset + length >= buffer.length) return { value: -1, length: -1 };
        currentByte = buffer[offset + length];
        value |= (currentByte & 0x7F) << (7 * length);
        length++;
        if (length > 5) return { value: -1, length: -1 };
    } while ((currentByte & 0x80) !== 0);
    
    return { value, length };
}

/**
 * Escribe un VarInt en un buffer
 */
function writeVarInt(value) {
    const bytes = [];
    do {
        let temp = value & 0x7F;
        value >>>= 7;
        if (value !== 0) temp |= 0x80;
        bytes.push(temp);
    } while (value !== 0);
    return Buffer.from(bytes);
}

/**
 * Maneja una conexión entrante
 */
async function handleConnection(clientSocket) {
    const clientAddress = clientSocket.remoteAddress;
    console.log(`[Proxy] Nueva conexión desde ${clientAddress}`);
    
    // Verificar si el servidor está corriendo
    const serverRunning = await checkServerStatus();
    
    if (serverRunning) {
        // Servidor está corriendo, hacer proxy de la conexión
        console.log(`[Proxy] Servidor activo, conectando cliente...`);
        
        const serverSocket = new net.Socket();
        
        serverSocket.connect(CONFIG.MC_SERVER_PORT, CONFIG.MC_SERVER_HOST, () => {
            console.log(`[Proxy] Cliente ${clientAddress} conectado al servidor`);
            clientSocket.pipe(serverSocket);
            serverSocket.pipe(clientSocket);
        });
        
        serverSocket.on('error', (err) => {
            console.log(`[Proxy] Error de servidor: ${err.message}`);
            clientSocket.destroy();
        });
        
        clientSocket.on('error', (err) => {
            console.log(`[Proxy] Error de cliente: ${err.message}`);
            serverSocket.destroy();
        });
        
        clientSocket.on('close', () => {
            serverSocket.destroy();
        });
        
        serverSocket.on('close', () => {
            clientSocket.destroy();
        });
        
    } else {
        // Servidor no está corriendo, manejar ping/login manualmente
        console.log(`[Proxy] Servidor inactivo, manejando solicitud...`);
        
        let buffer = Buffer.alloc(0);
        
        clientSocket.on('data', async (data) => {
            buffer = Buffer.concat([buffer, data]);
            
            if (buffer.length < 3) return;
            
            // Leer longitud del paquete
            const packetLength = readVarInt(buffer, 0);
            if (packetLength.value < 0) return;
            
            const packetStart = packetLength.length;
            if (buffer.length < packetStart + packetLength.value) return;
            
            // Leer ID del paquete
            const packetId = readVarInt(buffer, packetStart);
            
            // Handshake (0x00)
            if (packetId.value === 0x00) {
                const nextStateOffset = packetStart + packetId.length;
                
                // Buscar el estado siguiente (1 = status, 2 = login)
                let offset = nextStateOffset;
                
                // Saltar version (varint)
                const version = readVarInt(buffer, offset);
                offset += version.length;
                
                // Saltar server address (string)
                const addrLen = readVarInt(buffer, offset);
                offset += addrLen.length + addrLen.value;
                
                // Saltar port (unsigned short)
                offset += 2;
                
                // Leer next state
                const nextState = readVarInt(buffer, offset);
                
                if (nextState.value === 1) {
                    // Status request - responder con MOTD
                    console.log(`[Proxy] Solicitud de estado desde ${clientAddress}`);
                    
                    // Esperar el paquete de status request
                    buffer = Buffer.alloc(0);
                    
                    clientSocket.once('data', (statusData) => {
                        // Enviar respuesta de estado
                        let motd = CONFIG.SERVER_MOTD;
                        if (serverState.status === 'starting') {
                            motd = CONFIG.STARTING_MOTD;
                        }
                        
                        const jsonResponse = createStatusResponse(motd, 0, 20);
                        const jsonBuffer = Buffer.from(jsonResponse, 'utf8');
                        const jsonLenBuffer = writeVarInt(jsonBuffer.length);
                        
                        // Packet ID 0x00 para status response
                        const packetIdBuffer = writeVarInt(0x00);
                        const packetData = Buffer.concat([packetIdBuffer, jsonLenBuffer, jsonBuffer]);
                        const packetLenBuffer = writeVarInt(packetData.length);
                        
                        const responsePacket = Buffer.concat([packetLenBuffer, packetData]);
                        clientSocket.write(responsePacket);
                        
                        // Esperar ping
                        clientSocket.once('data', (pingData) => {
                            // Responder pong con los mismos datos
                            clientSocket.write(pingData);
                            clientSocket.end();
                        });
                    });
                    
                } else if (nextState.value === 2) {
                    // Login - iniciar servidor y desconectar con mensaje
                    console.log(`[Proxy] Intento de login desde ${clientAddress}`);
                    
                    // Iniciar el servidor
                    startMinecraftServer();
                    
                    // Desconectar con mensaje amigable
                    const message = JSON.stringify({
                        text: "§6§l¡Servidor iniciándose!\n\n§r§7El servidor estaba hibernando para ahorrar recursos.\n§aVuelve a conectarte en §e1-2 minutos§a."
                    });
                    
                    const msgBuffer = Buffer.from(message, 'utf8');
                    const msgLenBuffer = writeVarInt(msgBuffer.length);
                    const kickPacketId = writeVarInt(0x00); // Disconnect packet
                    const kickData = Buffer.concat([kickPacketId, msgLenBuffer, msgBuffer]);
                    const kickLenBuffer = writeVarInt(kickData.length);
                    
                    // Esperar el paquete de login start
                    clientSocket.once('data', () => {
                        clientSocket.write(Buffer.concat([kickLenBuffer, kickData]));
                        clientSocket.end();
                    });
                }
            }
            
            buffer = Buffer.alloc(0);
        });
        
        clientSocket.on('error', () => {});
    }
}

/**
 * Verificación periódica del estado del servidor
 */
setInterval(async () => {
    if (serverState.status === 'starting') {
        const isRunning = await checkServerStatus();
        if (isRunning) {
            console.log('[Proxy] ✅ Servidor de Minecraft está listo');
            serverState.status = 'running';
        }
    }
}, 10000);

// Crear servidor proxy
const server = net.createServer(handleConnection);

server.on('error', (err) => {
    console.error('[Proxy] Error del servidor:', err.message);
});

server.listen(CONFIG.PROXY_PORT, '0.0.0.0', () => {
    console.log(`[Proxy] ✅ Proxy escuchando en puerto ${CONFIG.PROXY_PORT}`);
    console.log('[Proxy] Esperando conexiones...');
    console.log('');
    
    // Verificar estado inicial
    checkServerStatus().then(running => {
        if (running) {
            console.log('[Proxy] Servidor de Minecraft detectado como activo');
        } else {
            console.log('[Proxy] Servidor de Minecraft no está corriendo (hibernando)');
        }
    });
});
