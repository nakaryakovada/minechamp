# 🎮 MineChamp - Instrucciones de Configuración Post-Deploy

¡Gracias por usar MineChamp! El template ha desplegado automáticamente **2 servicios**:
- 🚪 **Proxy Conect** - Encendido automático del servidor
- ⛏️ **MineChamp** - Servidor de Minecraft 1.21.11

**Solo necesitas configurar 2 variables en el Proxy** y ¡listo para jugar!

---

## ✅ Paso 1: Espera a que terminen de construirse (3-5 minutos)

Ambos servicios se están construyendo automáticamente. Verás:
- 🟡 **Building...** → 🟢 **Active** (Proxy Conect)
- 🟡 **Building...** → 🟢 **Active** (MineChamp)

**Espera a que ambos muestren** ✅ **"Active"** antes de continuar.

---

## 🔑 Paso 2: Configurar el Railway Token en el Proxy (IMPORTANTE)

Para que el proxy pueda encender automáticamente el servidor cuando alguien se conecta, necesitas configurar un token de Railway.

### 2.1 Crear el Token de Railway

1. Ve a: **https://railway.app/account/tokens**
2. Click en **"Create Token"**
3. Dale un nombre: `minechamp-proxy`
4. **Copia el token** que se genera (⚠️ solo se muestra una vez, guárdalo bien)

### 2.2 Obtener el Service ID del Servidor

1. En tu proyecto de Railway, click en el servicio **"MineChamp"** (el servidor)
2. Ve a la pestaña **"Settings"**
3. Baja hasta encontrar **"Service ID"**
4. **Copia ese ID** (algo como: `abc12345-def6-7890-ghij-klmnopqrstuv`)

### 2.3 Agregar las Variables al Proxy

1. Click en el servicio **"Proxy Conect"**
2. Ve a la pestaña **"Variables"**
3. Click en **"New Variable"** o **"Add Variable"**
4. Agrega estas **2 variables importantes**:

| Variable Name | Value | Dónde obtenerlo |
|---------------|-------|----------------|
| `RAILWAY_TOKEN` | `tu-token-aqui` | Paso 2.1 (tokens de Railway) |
| `RAILWAY_SERVICE_ID` | `abc12345-...` | Paso 2.2 (Service ID del servidor) |

5. Click en **"Add"** o presiona Enter en cada variable
6. El proxy se reiniciará automáticamente (espera ~30 segundos)

### 2.4 (Opcional) Agregar variables adicionales

Si quieres personalizar más, agrega también:

| Variable Name | Value Default | Descripción |
|---------------|---------------|-------------|
| `MC_SERVER_HOST` | `minechamp.railway.internal` | Host interno del servidor |
| `MC_SERVER_PORT` | `25565` | Puerto del servidor |
| `IDLE_TIMEOUT` | `10` | Minutos sin jugadores antes de apagar |

---

## 🌐 Paso 3: Obtener la Dirección del Servidor

1. Click en el servicio **"Proxy Conect"** (NO en MineChamp)
2. Ve a la pestaña **"Settings"**
3. En la sección **"Networking"** busca el **TCP Proxy**
4. Verás una dirección como: `proxy-production.up.railway.app:12345`
5. **Copia esa dirección completa** (con el puerto)

⚠️ **Importante:** Usa la dirección del **Proxy Conect**, NO del servidor MineChamp.

---

## 🎮 Paso 4: Conectarte desde Minecraft

1. Abre **Minecraft 1.21.11** (Java Edition)
2. Click en **"Multijugador"**
3. Click en **"Añadir Servidor"**
4. **Nombre del servidor:** Lo que quieras (ej: "MineChamp Server")
5. **Dirección del servidor:** Pega la dirección TCP del Proxy (del Paso 3)
6. Click en **"Listo"**
7. ¡Conéctate y juega!

---

## 💡 ¿Cómo funciona la Auto-Hibernación?

### Primera vez / Servidor apagado 😴
- Intentas conectarte → Verás **"Iniciando servidor..."**
- **Espera 1-2 minutos** mientras el servidor arranca automáticamente
- Vuelve a intentar conectarte → ¡Listo para jugar! 🎮

### Servidor activo 🟢
- Conexión **instantánea**, sin esperas

### Auto-apagado 💤
- Si no hay jugadores por **10 minutos**, el servidor se apaga solo
- El mundo se guarda automáticamente antes de apagar
- ¡Solo pagas cuando juegas! 💰

---

## ⚙️ Configuración Opcional

### Cambiar tiempo de inactividad

1. En Railway → Servicio **"MineChamp"** (servidor)
2. Variables → Busca o agrega `IDLE_TIMEOUT`
3. Cambia el valor (en minutos):
   - `5` = Más ahorro (apaga rápido)
   - `10` = Balance (default)
   - `30` = Más tiempo activo

### Permitir launchers alternativos (TLauncher, etc.)

✅ Ya está configurado por defecto: `ONLINE_MODE=false`

### Cambiar RAM del servidor

1. Variables del servidor **"MineChamp"** → `MEMORY_MAX`
2. Valores recomendados:
   - **1G** - Para 2-5 jugadores (bajo costo)
   - **2G** - Para 10-20 jugadores (default)
   - **4G** - Para 20+ jugadores (más potente)

### Personalizar el servidor

Variables disponibles en **"MineChamp"**:
- `DIFFICULTY`: `peaceful`, `easy`, `normal`, `hard`
- `GAMEMODE`: `survival`, `creative`, `adventure`, `spectator`
- `PVP`: `true` o `false`
- `MAX_PLAYERS`: Número máximo de jugadores
- `VIEW_DISTANCE`: Chunks de visión (6-16)

---

## 🛠️ Comandos de Administrador

Para ejecutar comandos, ve a Railway → Servicio **"MineChamp"** → Pestaña **"Logs"** → Escribe en la consola

**Comandos útiles:**
```
/op <jugador>              # Dar permisos de operador
/whitelist add <jugador>   # Añadir a lista blanca
/gamemode creative         # Cambiar a creativo
/time set day              # Cambiar a día
/difficulty peaceful       # Cambiar dificultad
/stop                      # Apagar servidor manualmente
```

---

## 🐛 Solución de Problemas

### "No puedo conectarme"
✅ **Verifica:**
- ¿Usaste la dirección TCP del **Proxy Conect** (no del servidor)?
- ¿Tienes **Minecraft 1.21.11**?
- ¿Configuraste el `RAILWAY_TOKEN` en el Proxy?
- ¿Ambos servicios están **Active** (verde)?

### "Dice 'Initiating server...'" o "Can't connect to server"
✅ **El servidor está encendiéndose:**
- Espera **1-2 minutos**
- Vuelve a intentar conectarte
- Es normal la primera vez o después de hibernación

### "El servidor no se enciende automáticamente"
✅ **Revisa el Proxy:**
1. ¿Configuraste el `RAILWAY_TOKEN` correctamente?
2. ¿Configuraste el `RAILWAY_SERVICE_ID` del servidor MineChamp?
3. Ve a Logs del **Proxy Conect**, busca errores
4. Debe decir: "✅ Proxy escuchando en puerto 25565"

### "Error: Variables de Railway no configuradas"
✅ **Falta configurar el Proxy:**
- Ve al Paso 2 y configura `RAILWAY_TOKEN` y `RAILWAY_SERVICE_ID`

### "Los logs del Proxy dicen: ERROR 401 o 403"
✅ **Token incorrecto:**
- El `RAILWAY_TOKEN` está mal o expiró
- Crea un nuevo token en https://railway.app/account/tokens
- Actualiza la variable en el Proxy

### "El mundo se perdió"
❌ **Esto no debería pasar**, el servidor guarda automáticamente  
✅ **Para más seguridad**, configura un **Volume**:
- Settings → Volumes → Add Volume
- Mount path: `/minecraft/world`
- Esto garantiza persistencia incluso si se borra el contenedor

---

## 💰 Monitorear Costos

1. Railway Dashboard → Tu proyecto
2. Click en **"Usage"** o **"Metrics"**
3. Verás consumo de CPU, RAM y costos estimados

**Costos estimados con auto-hibernación:**

| Uso | Horas/mes | Costo Proxy | Costo Server | Total |
|-----|-----------|-------------|--------------|-------|
| Casual (fines de semana) | ~20h | $1.00 | $3-4 | **$4-5/mes** |
| Regular (tardes) | ~40h | $1.00 | $6-7 | **$7-8/mes** |
| Intensivo (diario) | ~80h | $1.00 | $10-11 | **$11-12/mes** |
| 24/7 (sin hibernar) | 730h | $1.00 | $18-20 | **$19-21/mes** |

⚠️ **Con hibernación ahorras 60-70%** comparado con servidor 24/7

---

## 📊 Optimizar para Ahorrar Más

**En el servidor "MineChamp":**

1. **Reduce RAM** si tienes pocos jugadores:
   - `MEMORY_MAX=1G` para 2-5 jugadores

2. **Reduce View Distance**:
   - `VIEW_DISTANCE=6` (más ahorro)
   - `VIEW_DISTANCE=10` (default)

3. **Baja Idle Timeout** (apaga más rápido):
   - `IDLE_TIMEOUT=5` (apaga a los 5 min)

4. **Limita jugadores**:
   - `MAX_PLAYERS=10`

---

## 🎯 Próximos Pasos

- ✅ Invita amigos a jugar (comparte la dirección TCP del Proxy)
- ✅ Personaliza el MOTD del servidor
- ✅ Configura whitelist si quieres servidor privado
- ✅ Monitorea costos y ajusta variables según necesites
- ✅ Explora plugins (coloca `.jar` en carpeta `plugins/`)

---

## 📚 Documentación Completa

- **GitHub:** https://github.com/Dubbxd/minechamp
- **README:** [Ver documentación completa](https://github.com/Dubbxd/minechamp/blob/main/README.md)
- **Guía rápida:** [DEPLOY-GUIDE.md](https://github.com/Dubbxd/minechamp/blob/main/DEPLOY-GUIDE.md)

---

## ❓ ¿Necesitas Ayuda?

- 🐛 **Reportar problemas:** https://github.com/Dubbxd/minechamp/issues
- 💬 **Discusiones:** https://github.com/Dubbxd/minechamp/discussions
- 👨‍💻 **Creador:** [@Dubbxd](https://github.com/Dubbxd)

---

**¡Disfruta tu servidor MineChamp con auto-hibernación! ⛏️🎮💰**

*Ahorra hasta 70% en costos mientras juegas con tus amigos*
