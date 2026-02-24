<div align="center">

![MineChamp Logo](cube-trophy.svg)

# 🎮 MineChamp - Minecraft Server 1.21.11

### Servidor de Minecraft optimizado para Railway.app con Auto-Hibernación
**✅ Compatible con todos los launchers** - Mojang, TLauncher, MultiMC, etc.  
**😴 Se apaga automáticamente** cuando no hay jugadores  
**🚀 Se enciende solo** cuando alguien intenta conectarse  
**💰 Ahorra hasta 70%** en costos de hosting

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/minechamp)

**Desarrollado por [Dubbxd](https://github.com/Dubbxd)** | 📖 **[Guía Completa](SETUP-INSTRUCTIONS.md)**

---

</div>

## 🚀 Deploy Rápido (5 Pasos)

### 1️⃣ Click en Deploy [![Deploy](https://railway.app/button.svg)](https://railway.app/template/minechamp)

Railway desplegará automáticamente 2 servicios:
- 🚪 **Proxy Conect** - Encendido automático
- ⛏️ **MineChamp** - Servidor Minecraft 1.21.11

### 2️⃣ Espera 3-5 min hasta ver ✅ Active en ambos

### 3️⃣ Configura 2 Variables en el Proxy

**Crear Token:** https://railway.app/account/tokens → Copiar  
**Service ID:** MineChamp → Settings → Service ID → Copiar

En **Proxy Conect** → Variables → Agregar:
```
RAILWAY_TOKEN = [tu-token]
RAILWAY_SERVICE_ID = [service-id-del-servidor]
```

### 4️⃣ Obtén la Dirección TCP

**Proxy Conect** → Settings → Networking → **TCP Proxy** → Copiar (ej: `proxy.railway.app:12345`)

### 5️⃣ Conecta desde Minecraft 1.21.11

Multijugador → Añadir Servidor → Pega la dirección TCP → ¡Juega!

**Primera conexión:** Espera 1-2 min si dice "Iniciando servidor..." (está encendiendo automáticamente)

👉 **[Guía detallada con troubleshooting](SETUP-INSTRUCTIONS.md)**


---

# Deploy and Host MineChamp on Railway

MineChamp es un servidor de Minecraft 1.21.11 con auto-hibernación inteligente que se despliega en Railway con un solo click. Incluye un proxy para wake-on-connect y ahorra hasta 70% en costos de hosting.

## About Hosting MineChamp

Hosting MineChamp en Railway despliega automáticamente dos servicios containerizados: un proxy ligero Node.js (~50MB) que detecta conexiones de jugadores y enciende el servidor automáticamente mediante la Railway API, y el servidor Minecraft 1.21.11 con auto-hibernación que se apaga tras 10 minutos sin jugadores. El servidor incluye Java 21 con optimizaciones JVM (Aikar's Flags), variables de entorno configurables, y compatibilidad con todos los launchers. Railway proporciona TCP Proxy automático, métricas en tiempo real, y facturación por uso real - solo pagas cuando el servidor está activo.

## Common Use Cases

- **Servidor Privado para Amigos (2-10 jugadores)** - Se enciende automáticamente cuando alguien quiere jugar, whitelist para privacidad, ~$4-7/mes
- **Servidor Educativo o de Aula** - Auto-apagado fuera del horario escolar, control total de configuración, económico para presupuestos limitados
- **Servidor de Pruebas y Desarrollo** - Testea mods, plugins o configuraciones sin desperdiciar recursos cuando no está en uso
- **Servidor Comunitario Pequeño (10-20 jugadores)** - Auto-hibernación durante horas de poca actividad, escalable según crece la comunidad
- **Servidor SMP Casual** - Para grupos que juegan fines de semana, acceso 24/7 vía proxy pero solo pagas horas de juego real

## Dependencies for MineChamp Hosting

- **Railway Account Token** - Crea en [railway.app/account/tokens](https://railway.app/account/tokens) para que el proxy pueda encender el servidor automáticamente
- **Service ID del Servidor** - Obtenido desde Railway Dashboard → MineChamp → Settings → Service ID
- **Minecraft Java Edition 1.21.11** - Requerido para conectarse al servidor

### Deployment Dependencies

**Servicio 1: Proxy Conect**
- Node.js 20 Alpine (incluido en [Dockerfile](proxy/Dockerfile))
- [minecraft-protocol](https://www.npmjs.com/package/minecraft-protocol) npm package (auto-instalado)
- Railway API GraphQL client integrado para wake-on-connect

**Servicio 2: MineChamp Server**
- Java 21 Eclipse Temurin (incluido en [Dockerfile](Dockerfile))
- Bash shell en Alpine Linux base
- [server.jar Minecraft 1.21.11](https://www.minecraft.net/en-us/download/server) (incluido en repositorio)
- hibernate-monitor.sh script de monitoreo (incluido en [start.sh](start.sh))

**Archivos de Configuración Incluidos:**
- [eula.txt](eula.txt) - EULA de Minecraft aceptada
- [server.properties](server.properties) - Configuración base del servidor
- [railway.json](railway.json) - Configuración del template multi-servicio

**Enlaces de Referencia:**
- [Repositorio GitHub](https://github.com/Dubbxd/minechamp)
- [Guía Completa de Configuración](SETUP-INSTRUCTIONS.md)
- [Guía Rápida de Despliegue](DEPLOY-GUIDE.md)

## Why Deploy MineChamp on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying MineChamp on Railway, you are one step closer to supporting a complete full-stack application with minimal burden. Host your servers, databases, AI agents, and more on Railway.

**Beneficios específicos de MineChamp en Railway:**
- **Auto-Hibernación Nativa** - Solo pagas cuando juegas, ahorro del 60-70% vs servidores 24/7
- **TCP Proxy Automático** - Railway configura networking automáticamente para Minecraft
- **Escalabilidad Sencilla** - Ajusta RAM y recursos según necesidad sin reconfiguración
- **Despliegue Multi-Servicio** - Proxy + Servidor desplegados automáticamente con un click
- **Facturación por Uso Real** - Métricas precisas de consumo y costos en tiempo real

---

## 📚 Documentación Adicional

- **[SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md)** - Guía completa paso a paso con troubleshooting
- **[DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)** - Guía rápida de despliegue
- **GitHub:** https://github.com/Dubbxd/minechamp

---

## 🛠️ Variables de Configuración

### Variables del Servidor (MineChamp)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MEMORY_MIN` | `1G` | RAM mínima |
| `MEMORY_MAX` | `2G` | RAM máxima |
| `ONLINE_MODE` | `false` | Verificación Mojang |
| `MAX_PLAYERS` | `20` | Jugadores máximos |
| `DIFFICULTY` | `normal` | Dificultad |
| `GAMEMODE` | `survival` | Modo de juego |
| `IDLE_TIMEOUT` | `10` | Minutos antes de hibernar |

### Variables del Proxy (Proxy Conect)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `RAILWAY_TOKEN` | ✅ Sí | Token de railway.app/account/tokens |
| `RAILWAY_SERVICE_ID` | ✅ Sí | Service ID del servidor MineChamp |
| `MC_SERVER_HOST` | No | Default: minechamp.railway.internal |
| `MC_SERVER_PORT` | No | Default: 25565 |

---

## 💰 Estimación de Costos

| Uso | Horas/mes | Proxy | Server | Total |
|-----|-----------|-------|--------|-------|
| Casual (fines de semana) | ~20h | $1 | $3-4 | **$4-5/mes** |
| Regular (tardes) | ~40h | $1 | $6-7 | **$7-8/mes** |
| Intensivo (diario) | ~80h | $1 | $10-11 | **$11-12/mes** |
| 24/7 (sin hibernar) | 730h | $1 | $18-20 | **$19-21/mes** |

⚠️ **Con hibernación ahorras 60-70%** vs servidor 24/7

---

## 👨‍💻 Autor

**Dubbxd** - [@Dubbxd](https://github.com/Dubbxd)

**Stack:** Minecraft 1.21.11 Vanilla | Java 21 | Docker Alpine | Railway.app | Aikar's JVM Flags

---

**¡Servidor listo en 5 minutos! 🚂⛏️**
