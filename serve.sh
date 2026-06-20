#!/bin/bash
# Auto-deploy: serve the game and watch for changes
cd /home/jrhol/sci-fi-princesses/public

# Kill any existing server on port 8080
pkill -f "python3 -m http.server 8080" 2>/dev/null || true
pkill -f "http-server" 2>/dev/null || true

# Start server in background
python3 -m http.server 8080 &
SERVER_PID=$!
echo "Server started on http://localhost:8080 (PID: $SERVER_PID)"

# Watch for file changes and auto-refresh via WebSocket-like polling
# For now, the game auto-reloads on save via simple approach:
# We use inotifywait to detect changes and touch a signal file
if command -v inotifywait &> /dev/null; then
  echo "Watching for changes..."
  while true; do
    inotifywait -e modify /home/jrhol/sci-fi-princesses/public/ 2>/dev/null
    echo "File changed at $(date) - refresh browser to see updates"
  done
else
  echo "Install inotify-tools for auto-refresh notifications"
  echo "Game running at http://localhost:8080"
fi
