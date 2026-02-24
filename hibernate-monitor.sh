#!/bin/bash
# Monitor de Hibernación para MineChamp Server
# Monitorea jugadores conectados y apaga el servidor si está inactivo

# Configuración desde variables de entorno
IDLE_TIMEOUT=${IDLE_TIMEOUT:-10}  # Minutos sin jugadores antes de apagar
CHECK_INTERVAL=${CHECK_INTERVAL:-30}  # Segundos entre cada verificación
SERVER_LOG="/minecraft/logs/latest.log"

echo "[Hibernate] Monitor iniciado"
echo "[Hibernate] Apagado automático después de ${IDLE_TIMEOUT} minutos sin jugadores"

# Contador de tiempo sin jugadores (en segundos)
idle_time=0
idle_threshold=$((IDLE_TIMEOUT * 60))
server_ready=false

# Esperar a que el servidor inicie completamente
echo "[Hibernate] Esperando a que el servidor inicie..."
while [ "$server_ready" = false ]; do
    sleep 10
    if [ -f "$SERVER_LOG" ]; then
        if grep -q "Done" "$SERVER_LOG" 2>/dev/null; then
            server_ready=true
            echo "[Hibernate] Servidor iniciado correctamente"
        fi
    fi
done

# Dar tiempo adicional para estabilizar
sleep 30
echo "[Hibernate] Monitoreo activo"

while true; do
    # Verificar si el servidor sigue corriendo
    if ! pgrep -f "server.jar" > /dev/null; then
        echo "[Hibernate] Servidor no detectado, terminando monitor"
        exit 0
    fi
    
    # Método 1: Buscar en el log la lista de jugadores
    # El servidor registra cuando los jugadores se conectan/desconectan
    
    # Contar jugadores basándose en los últimos eventos de login/logout
    # Buscar las últimas 100 líneas del log para eventos recientes
    if [ -f "$SERVER_LOG" ]; then
        # Buscar el último mensaje de "list" o contar logins vs logouts
        recent_joins=$(tail -200 "$SERVER_LOG" 2>/dev/null | grep -c "joined the game" 2>/dev/null || echo "0")
        recent_leaves=$(tail -200 "$SERVER_LOG" 2>/dev/null | grep -c "left the game" 2>/dev/null || echo "0")
        
        # Asegurar que son números válidos
        recent_joins=${recent_joins:-0}
        recent_leaves=${recent_leaves:-0}
        
        # También verificar mensajes del tipo "There are X of"
        last_list=$(tail -50 "$SERVER_LOG" 2>/dev/null | grep "There are" | tail -1 2>/dev/null || echo "")
        
        if [[ ! -z "$last_list" ]]; then
            player_count=$(echo "$last_list" | grep -oP 'There are \K[0-9]+' 2>/dev/null || echo "0")
        else
            # Estimación basada en joins vs leaves
            player_count=$((recent_joins - recent_leaves))
            if [ $player_count -lt 0 ]; then
                player_count=0
            fi
        fi
    else
        player_count=0
    fi
    
    # Asegurar que player_count es un número válido
    if ! [[ "$player_count" =~ ^[0-9]+$ ]]; then
        player_count=0
    fi
    
    current_time=$(date '+%H:%M:%S')
    
    if [ "$player_count" -le 0 ]; then
        # No hay jugadores o no se puede determinar
        idle_time=$((idle_time + CHECK_INTERVAL))
        remaining=$((idle_threshold - idle_time))
        remaining_min=$((remaining / 60))
        
        if [ $remaining_min -le 5 ] && [ $remaining_min -gt 0 ]; then
            echo "[Hibernate] [$current_time] Sin jugadores - Apagado en ${remaining_min} min"
        fi
        
        if [[ $idle_time -ge $idle_threshold ]]; then
            echo ""
            echo "[Hibernate] =========================================="
            echo "[Hibernate]   TIEMPO DE INACTIVIDAD ALCANZADO"
            echo "[Hibernate]   Apagando servidor para ahorrar recursos..."
            echo "[Hibernate] =========================================="
            
            # Enviar comando stop al proceso del servidor
            # El servidor guarda el mundo automáticamente antes de cerrar
            pkill -SIGTERM -f "server.jar"
            
            sleep 10
            
            # Forzar cierre si aún está corriendo
            if pgrep -f "server.jar" > /dev/null; then
                pkill -SIGKILL -f "server.jar"
            fi
            
            exit 0
        fi
    else
        # Hay jugadores conectados
        if [[ $idle_time -gt 0 ]]; then
            echo "[Hibernate] [$current_time] Jugadores detectados (~${player_count}) - Timer reiniciado"
        fi
        idle_time=0
    fi
    
    sleep ${CHECK_INTERVAL}
done
