# MineChamp Wake-on-Connect Proxy

Proxy ligero que enciende automáticamente el servidor de Minecraft cuando un jugador intenta conectarse.

## ¿Cómo funciona?

```
Jugador ──► Proxy (siempre activo) ──► Detecta conexión ──► Enciende servidor MC ──► Conecta jugador
                    │
                    └── Si el servidor ya está activo, hace proxy directo
```

## Despliegue en Railway

### Paso 1: Crear el servicio del Proxy

1. En tu proyecto de Railway, click en **"+ New Service"**
2. Selecciona **"GitHub Repo"** y elige este repositorio
3. En **"Root Directory"** escribe: `proxy`
4. Railway detectará el Dockerfile automáticamente

### Paso 2: Configurar variables de entorno del Proxy

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `RAILWAY_TOKEN` | Token de API de Railway | `xxxxxxxx-xxxx-xxxx-xxxx` |
| `RAILWAY_SERVICE_ID` | ID del servicio de Minecraft | `abc123-def456` |
| `RAILWAY_ENVIRONMENT_ID` | ID del environment | `production` |
| `MC_SERVER_HOST` | Host interno del servidor MC | `minechamp.railway.internal` |
| `MC_SERVER_PORT` | Puerto interno del servidor MC | `25565` |

### Paso 3: Obtener el Railway Token

1. Ve a [Railway Account Settings](https://railway.app/account/tokens)
2. Click en **"Create Token"**
3. Copia el token y guárdalo en las variables del proxy

### Paso 4: Obtener el Service ID

1. En tu proyecto de Railway, click en el servicio de Minecraft
2. Ve a **Settings** → copia el **Service ID**

### Paso 5: Configurar networking

1. **En el Proxy**: Configura el TCP Proxy público (este es el que darás a los jugadores)
2. **En el Minecraft Server**: Usa solo red interna (Private Networking)

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PROXY_PORT` | `25565` | Puerto donde escucha el proxy |
| `MC_SERVER_HOST` | `localhost` | Host del servidor de Minecraft |
| `MC_SERVER_PORT` | `25565` | Puerto del servidor de Minecraft |
| `RAILWAY_TOKEN` | - | Token de API de Railway (requerido) |
| `RAILWAY_SERVICE_ID` | - | ID del servicio de MC (requerido) |
| `RAILWAY_ENVIRONMENT_ID` | `production` | Environment de Railway |
| `SERVER_MOTD` | `MineChamp \| Click para iniciar` | MOTD cuando el servidor está apagado |
| `STARTING_MOTD` | `MineChamp \| Iniciando...` | MOTD mientras inicia |
| `COOLDOWN_MINUTES` | `2` | Minutos entre requests de inicio |

## Costos Estimados

- **Proxy solo**: ~$0.50-1.00 USD/mes (siempre activo, muy ligero)
- **Servidor MC hibernando**: Solo paga cuando está activo

**Ahorro total**: 60-80% comparado con servidor 24/7
