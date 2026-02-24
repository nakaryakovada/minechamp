# Cómo publicar MineChamp como Template en Railway

## Preparación

1. **Asegúrate de que todo esté en GitHub:**
   ```bash
   git add .
   git commit -m "Template completo con proxy wake-on-connect"
   git push origin main
   ```

2. **Verifica que los archivos clave existan:**
   - ✅ `railway.json` - Configuración multi-servicio
   - ✅ `Dockerfile` - Para el servidor de Minecraft
   - ✅ `proxy/Dockerfile` - Para el proxy
   - ✅ `README.md` - Documentación completa

## Publicar en Railway

### ⚠️ Importante: Railway Templates NO soportan multi-servicio automático

Railway actualmente no permite crear templates con múltiples servicios desde un solo repositorio de forma automática. 

**Tienes 2 opciones:**

---

### Opción 1: Template Simple (Solo Servidor) - Recomendado para principiantes

Este approach despliega solo el servidor de Minecraft con auto-hibernación. Los usuarios tendrán que encender manualmente el servidor desde Railway Dashboard.

1. **El template actual ya funciona así** (1 servicio)
2. **Actualiza la descripción:**
   ```
   Servidor de Minecraft 1.21.11 con auto-hibernación inteligente. Se apaga automáticamente cuando no hay jugadores por 10 minutos. Ahorra hasta 70% en costos. Compatible con todos los launchers.
   ```
3. **Los usuarios tendrán que:**
   - Conectarse a la dirección TCP del servidor directamente
   - Encender manualmente desde Railway si está apagado
   - Esperar que se apague solo cuando no haya jugadores

---

### Opción 2: Instrucciones para Deploy Manual de 2 Servicios - Para usuarios avanzados

Actualiza el README con instrucciones para que los usuarios creen ambos servicios manualmente:

Actualiza el README.md con la URL del template:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/minechamp)
```

Reemplaza `/minechamp` con el slug que Railway te asigne.

## Probar el Template

1. **Haz click en tu botón de Deploy**
2. **Verifica que:**
   - Se crean ambos servicios (Proxy + Server)
   - Las variables de entorno se configuran correctamente
   - El Proxy obtiene un TCP domain automáticamente
   - El Server usa solo Private Networking

3. **Configura el RAILWAY_TOKEN:**
   - Ve a https://railway.app/account/tokens
   - Crea un token
   - Pégalo en la variable del Proxy

4. **Prueba la conexión:**
   - Copia el TCP domain del Proxy
   - Conéctate desde Minecraft
   - Verifica que el servidor se encienda automáticamente

## Mantener el Template Actualizado

Cada vez que actualices el repositorio:

```bash
git add .
git commit -m "Actualización: descripción del cambio"
git push origin main
```

Railway actualizará automáticamente el template para nuevos deploys.

## Promocionar el Template

1. **Añade badges al README:**
   ```markdown
   ![Railway Deploy](https://img.shields.io/badge/Deploy-Railway-blueviolet)
   ![Minecraft Version](https://img.shields.io/badge/Minecraft-1.21.11-green)
   ![License](https://img.shields.io/badge/License-MIT-blue)
   ```

2. **Comparte en:**
   - Railway Discord
   - Reddit: r/admincraft, r/railway
   - Twitter/X con hashtags: #minecraft #railway #gamedev

3. **Crea un video tutorial** (opcional)
   - Muestra el deploy en 5 minutos
   - Explica la auto-hibernación
   - Sube a YouTube

## Métricas y Analytics

Monitorea el uso del template en:
- Railway Dashboard → Templates → Ver estadísticas
- GitHub Insights → Traffic

---

**¡Listo para compartir tu template con la comunidad!** 🚀
