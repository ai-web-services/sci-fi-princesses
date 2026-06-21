const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 8090;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

// Live-reload script injected into HTML pages
const RELOAD_SCRIPT = `
<script>
(function() {
  const ws = new WebSocket('ws://' + location.host);
  ws.onmessage = function(e) {
    if (e.data === 'reload') location.reload();
  };
  ws.onclose = function() {
    setTimeout(() => location.reload(), 1000);
  };
})();
</script>
`;

// Build the server
const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Inject live-reload script into HTML files
    if (ext === '.html') {
      data = data.toString().replace('</body>', RELOAD_SCRIPT + '</body>');
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    res.end(data);
  });
});

// WebSocket server for live reload
const wss = new WebSocketServer({ server });

// Watch for file changes
let reloadTimeout = null;
fs.watch(PUBLIC_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.js') || filename.endsWith('.html') || filename.endsWith('.css'))) {
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send('reload');
        }
      });
    }, 100);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Stellar Princesses server running at http://127.0.0.1:${PORT}`);
  console.log('Live reload enabled — edit files and the browser will refresh automatically.');
});
