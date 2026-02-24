# 🚀 Guía de Despliegue Rápido - MineChamp

## Opción 1: Deploy Completo (Recomendado) ⭐

### Paso 1: Click en Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/minechamp)

### Paso 2: Railway creará 2 servicios automáticamente

```
┌─────────────────────────────────────────────┐
│           Tu Proyecto en Railway            │
├─────────────────────────────────────────────┤
│                                             │
│  🚪 MineChamp Proxy     ⛏️ MineChamp       │
│     (Node.js)              (Minecraft)      │
│     ~$1/mes                 Variable        │
│                                             │
└─────────────────────────────────────────────┘
```

### Paso 3: Configurar Railway Token (Solo una vez)

1. Ve a: https://railway.app/account/tokens
2. Click **"Create Token"**
3. Copia el token
4. En Railway → **MineChamp Proxy** → **Variables** → `RAILWAY_TOKEN`
5. Pega el token y guarda

### Paso 4: Obtener la dirección del servidor

1. En Railway → Click en **"MineChamp Proxy"**
2. Pestaña **"Networking"**
3. Copia el dominio TCP (ej: `minechamp.railway.app:12345`)

### Paso 5: ¡Jugar!

1. Abre Minecraft 1.21.11
2. Multijugador → Añadir Servidor
3. Pega la dirección
4. ¡Conecta!

---

## ¿Cómo funciona el sistema?

### Primera conexión (servidor apagado)
```
Jugador intenta conectar
        ↓
MineChamp Proxy detecta
        ↓
Llama API de Railway
        ↓
Servidor Minecraft inicia
        ↓
Jugador ve: "Iniciando servidor..."
        ↓
[Espera 1-2 minutos]
        ↓
Jugador reconecta → ¡A jugar!
```

### Conexiones posteriores (servidor activo)
```
Jugador intenta conectar
        ↓
Proxy hace forwarding directo
        ↓
¡Conexión instantánea!
```

### Auto-apagado
```
Sin jugadores por 10 minutos
        ↓
Servidor guarda el mundo
        ↓
Servidor se apaga
        ↓
¡Solo pagas cuando juegas!
```

---

## Costos Estimados

| Uso | Horas/mes | Costo Proxy | Costo Server | Total |
|-----|-----------|-------------|--------------|-------|
| Casual (fines de semana) | ~20h | $1 | $3-4 | **~$4-5** |
| Regular (tardes) | ~40h | $1 | $6-7 | **~$7-8** |
| Intensivo (diario) | ~80h | $1 | $10-11 | **~$11-12** |

**vs Servidor 24/7 sin hibernación: ~$15-20/mes**

---

## Variables Importantes

### MineChamp Proxy

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `RAILWAY_TOKEN` | (tu token) | **Requerido** - Token de Railway API |
| `MC_SERVER_HOST` | Auto | Se configura automáticamente |
| `IDLE_TIMEOUT` | 10 | Minutos antes de apagar |

### MineChamp Server

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `MEMORY_MAX` | 2G | RAM máxima del servidor |
| `MAX_PLAYERS` | 20 | Jugadores simultáneos |
| `ONLINE_MODE` | false | Permite launchers alternativos |
| `ENABLE_HIBERNATE` | true | Auto-apagado activado |

---

## Solución de Problemas

### "No puedo conectarme"

✅ **Verifica:**
1. ¿Usaste el dominio TCP del **Proxy** (no del server)?
2. ¿Estás usando Minecraft versión 1.21.11?
3. ¿Esperaste 1-2 minutos si decía "Iniciando servidor..."?

### "El servidor no se enciende automáticamente"

✅ **Verifica:**
1. ¿Configuraste el `RAILWAY_TOKEN` en el Proxy?
2. En logs del Proxy, ¿aparece "✅ Servidor iniciándose"?
3. Variables: `RAILWAY_SERVICE_ID` debe apuntar al servidor

### "El proxy está caído"

✅ **Solución:**
1. En Railway → MineChamp Proxy → Deployments
2. Click en "Redeploy"

### "Cuesta mucho"

✅ **Optimiza:**
1. Reduce `MEMORY_MAX` a 1G si tienes pocos jugadores
2. Reduce `IDLE_TIMEOUT` a 5 minutos
3. Reduce `VIEW_DISTANCE` a 6-8 chunks

---

## FAQ

**¿Necesito dominio personalizado?**
❌ No, Railway te da uno gratis.

**¿Funciona con TLauncher?**
✅ Sí, `ONLINE_MODE=false` permite launchers alternativos.

**¿Puedo usar plugins?**
✅ Sí, coloca los `.jar` en la carpeta `plugins/`

**¿Se pierden los mundos?**
❌ No, los mundos se guardan automáticamente antes de apagar.

**¿Puedo desactivar la hibernación?**
✅ Sí, configura `ENABLE_HIBERNATE=false`

**¿Cuánto tarda en encender?**
⏱️ Entre 1-2 minutos desde que alguien se conecta.

---

## Siguiente Paso

Una vez desplegado:

1. 🎮 **Invita amigos** - Comparte tu dirección TCP
2. ⚙️ **Personaliza** - Ajusta variables según tus necesidades
3. 📊 **Monitorea** - Revisa los logs y costos en Railway
4. 🔧 **Modifica** - Edita `server.properties` para configuraciones avanzadas

**¡Disfruta tu servidor!** ⛏️🎮
