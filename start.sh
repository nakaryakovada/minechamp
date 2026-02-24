#!/bin/bash
# Script de inicio para MineChamp Server en Railway/Linux
# Version 1.21.11 con Auto-Hibernación

echo "=========================================="
echo "      MineChamp Server v1.21.11"
echo "    Iniciando en Railway.app..."
echo "=========================================="
echo ""

# Verificar que existe el JAR del servidor
if [ ! -f "server.jar" ]; then
    echo "ERROR: server.jar no encontrado!"
    exit 1
fi

# Usar variables de entorno o valores por defecto
MEMORY_MIN=${MEMORY_MIN:-1G}
MEMORY_MAX=${MEMORY_MAX:-2G}
SERVER_PORT=${SERVER_PORT:-25565}
ENABLE_HIBERNATE=${ENABLE_HIBERNATE:-true}
IDLE_TIMEOUT=${IDLE_TIMEOUT:-10}

# Actualizar server.properties con variables de entorno
if [ -f "server.properties" ]; then
    echo "Configurando server.properties con variables de entorno..."
    sed -i "s/server-port=.*/server-port=${SERVER_PORT}/" server.properties
    sed -i "s/online-mode=.*/online-mode=${ONLINE_MODE:-false}/" server.properties
    sed -i "s/max-players=.*/max-players=${MAX_PLAYERS:-20}/" server.properties
    sed -i "s/view-distance=.*/view-distance=${VIEW_DISTANCE:-10}/" server.properties
    sed -i "s/difficulty=.*/difficulty=${DIFFICULTY:-normal}/" server.properties
    sed -i "s/gamemode=.*/gamemode=${GAMEMODE:-survival}/" server.properties
    sed -i "s/pvp=.*/pvp=${PVP:-true}/" server.properties
    
    # Configurar MOTD si está definido
    if [ ! -z "$MOTD" ]; then
        sed -i "s/motd=.*/motd=${MOTD}/" server.properties
    fi
fi

# Mostrar configuración
echo "Configuración del servidor:"
echo "  RAM: ${MEMORY_MIN} - ${MEMORY_MAX}"
echo "  Puerto: ${SERVER_PORT}"
echo "  Jugadores máximos: ${MAX_PLAYERS:-20}"
echo "  Dificultad: ${DIFFICULTY:-normal}"
echo ""
echo "Auto-Hibernación:"
echo "  Habilitada: ${ENABLE_HIBERNATE}"
if [ "$ENABLE_HIBERNATE" = "true" ]; then
    echo "  Apagado tras inactividad: ${IDLE_TIMEOUT} minutos"
fi
echo ""

# Flags de JVM optimizadas (Aikar's flags adaptadas)
JVM_FLAGS="-Xms${MEMORY_MIN} -Xmx${MEMORY_MAX} \
-XX:+UseG1GC \
-XX:+ParallelRefProcEnabled \
-XX:MaxGCPauseMillis=200 \
-XX:+UnlockExperimentalVMOptions \
-XX:+DisableExplicitGC \
-XX:+AlwaysPreTouch \
-XX:G1NewSizePercent=30 \
-XX:G1MaxNewSizePercent=40 \
-XX:G1HeapRegionSize=8M \
-XX:G1ReservePercent=20 \
-XX:G1HeapWastePercent=5 \
-XX:G1MixedGCCountTarget=4 \
-XX:InitiatingHeapOccupancyPercent=15 \
-XX:G1MixedGCLiveThresholdPercent=90 \
-XX:G1RSetUpdatingPauseTimePercent=5 \
-XX:SurvivorRatio=32 \
-XX:+PerfDisableSharedMem \
-XX:MaxTenuringThreshold=1 \
-Dusing.aikars.flags=https://mcflags.emc.gs \
-Daikars.new.flags=true"

# Iniciar monitor de hibernación en segundo plano si está habilitado
if [ "$ENABLE_HIBERNATE" = "true" ] && [ -f "/minecraft/hibernate-monitor.sh" ]; then
    echo "Iniciando monitor de auto-hibernación..."
    /minecraft/hibernate-monitor.sh &
    echo ""
fi

echo "Iniciando servidor Minecraft..."
echo ""

# Ejecutar el servidor
exec java $JVM_FLAGS -jar server.jar nogui
