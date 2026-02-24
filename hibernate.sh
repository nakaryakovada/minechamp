#!/bin/bash
# Script de Auto-Hibernación para MineChamp Server
# Apaga el servidor automáticamente cuando no hay jugadores conectados

# Configuración (usar variables de entorno o valores por defecto)
IDLE_TIMEOUT=${IDLE_TIMEOUT:-10}  # Minutos sin jugadores antes de apagar
CHECK_INTERVAL=${CHECK_INTERVAL:-60}  # Segundos entre cada verificación
RCON_PASSWORD=${RCON_PASSWORD:-minechamp}
RCON_PORT=${RCON_PORT:-25575}

echo "=========================================="
echo "   MineChamp Auto-Hibernation Monitor"
echo "=========================================="
echo "Tiempo de inactividad: ${IDLE_TIMEOUT} minutos"
echo "Intervalo de verificación: ${CHECK_INTERVAL} segundos"
echo ""

# Contador de tiempo sin jugadores (en segundos)
idle_time=0
idle_threshold=$((IDLE_TIMEOUT * 60))

# Esperar a que el servidor inicie completamente
echo "Esperando 60 segundos para que el servidor inicie..."
sleep 60

echo "Monitor de hibernación activo."
echo ""

while true; do
    # Obtener número de jugadores usando RCON
    # El comando 'list' devuelve algo como: "There are 0 of a max of 20 players online:"
    player_output=$(echo "list" | timeout 5 java -jar /minecraft/rcon-cli.jar --host localhost --port ${RCON_PORT} --password ${RCON_PASSWORD} 2>/dev/null || echo "error")
    
    # Extraer número de jugadores (buscar el primer número)
    if [[ "$player_output" == *"error"* ]] || [[ -z "$player_output" ]]; then
        # Si RCON falla, intentar con el log del servidor
        # Buscar líneas recientes de login/logout
        echo "[$(date '+%H:%M:%S')] RCON no disponible, usando método alternativo..."
        player_count=-1
    else
        # Extraer el número de jugadores del output
        player_count=$(echo "$player_output" | grep -oP 'There are \K[0-9]+' || echo "0")
    fi
    
    if [[ "$player_count" == "0" ]] || [[ "$player_count" == "-1" ]]; then
        # No hay jugadores, incrementar contador de inactividad
        idle_time=$((idle_time + CHECK_INTERVAL))
        remaining=$((idle_threshold - idle_time))
        remaining_min=$((remaining / 60))
        
        echo "[$(date '+%H:%M:%S')] Sin jugadores - Apagado en ${remaining_min} minutos (${remaining}s)"
        
        if [[ $idle_time -ge $idle_threshold ]]; then
            echo ""
            echo "=========================================="
            echo "  TIEMPO DE INACTIVIDAD ALCANZADO"
            echo "  Apagando servidor para ahorrar recursos..."
            echo "=========================================="
            
            # Intentar apagar gracefully con RCON
            echo "stop" | timeout 10 java -jar /minecraft/rcon-cli.jar --host localhost --port ${RCON_PORT} --password ${RCON_PASSWORD} 2>/dev/null
            
            # Si RCON falla, forzar salida
            sleep 5
            exit 0
        fi
    else
        # Hay jugadores conectados, resetear contador
        if [[ $idle_time -gt 0 ]]; then
            echo "[$(date '+%H:%M:%S')] Jugadores detectados (${player_count}) - Reiniciando contador de inactividad"
        fi
        idle_time=0
    fi
    
    sleep ${CHECK_INTERVAL}
done
