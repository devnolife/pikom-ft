#!/usr/bin/env bash
# =============================================================================
# Production server controller untuk PIKOM FT (Next.js standalone).
# Usage:
#   ./scripts/prod.sh start | stop | restart | status | logs | build
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT="${PIKOM_PORT:-${PORT:-3077}}"
HOSTNAME_BIND="${PIKOM_HOST:-0.0.0.0}"
LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/prod.log"
PID_FILE="$LOG_DIR/prod.pid"
STANDALONE="$ROOT/.next/standalone/server.js"

mkdir -p "$LOG_DIR"

load_env() {
  if [ -f "$ROOT/.env" ]; then
    set -a; . "$ROOT/.env"; set +a
  fi
}

stage_standalone() {
  if [ ! -f "$STANDALONE" ]; then
    echo "❌ $STANDALONE belum ada — jalankan 'npm run build' dulu." >&2
    exit 1
  fi
  cp -r "$ROOT/public" "$ROOT/.next/standalone/public" 2>/dev/null || true
  mkdir -p "$ROOT/.next/standalone/.next"
  cp -r "$ROOT/.next/static" "$ROOT/.next/standalone/.next/static"
}

is_running() { [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; }

cmd_build() { npm run build; stage_standalone; echo "✅ build + stage selesai."; }

cmd_start() {
  if is_running; then echo "ℹ️  sudah jalan (PID $(cat "$PID_FILE"))"; return 0; fi
  load_env; stage_standalone
  PORT="$PORT" HOSTNAME="$HOSTNAME_BIND" nohup node "$STANDALONE" > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"; disown || true; sleep 2
  if is_running; then
    echo "✅ started PID $(cat "$PID_FILE") @ http://localhost:$PORT"
  else
    echo "❌ gagal start — cek $LOG_FILE" >&2; exit 1
  fi
}

cmd_stop() {
  if is_running; then
    PID="$(cat "$PID_FILE")"; kill "$PID"; sleep 1
    kill -0 "$PID" 2>/dev/null && kill -9 "$PID" || true
    rm -f "$PID_FILE"; echo "🛑 stopped PID $PID"
  else
    echo "ℹ️  tidak ada server yang jalan."; rm -f "$PID_FILE"
  fi
}

cmd_status() {
  if is_running; then
    PID="$(cat "$PID_FILE")"; echo "🟢 RUNNING — PID $PID, port $PORT"
    ps -p "$PID" -o pid,etime,rss,cmd --no-headers || true
  else
    echo "🔴 STOPPED"
  fi
}

cmd_logs() { tail -f "$LOG_FILE"; }

case "${1:-}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_stop || true; cmd_start ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  build)   cmd_build ;;
  *) echo "Usage: $0 {start|stop|restart|status|logs|build}"; exit 1 ;;
esac
