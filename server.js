const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 8090;
const PUBLIC_DIR = path.join(__dirname, 'public');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

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
  // F9 to save screenshot
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F9') {
      e.preventDefault();
      const canvas = document.querySelector('canvas');
      if (canvas) {
        fetch('/screenshot', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({data: canvas.toDataURL('image/png')})
        }).then(r => r.text()).then(t => console.log('Screenshot saved:', t));
      }
    }
  });
})();
</script>
`;

// Build the server
const server = http.createServer((req, res) => {
  // Handle screenshot POST
  if (req.method === 'POST' && req.url === '/screenshot') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { data } = JSON.parse(body);
        const base64 = data.replace(/^data:image\/png;base64,/, '');
        const filename = `screenshot_${Date.now()}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);
        fs.writeFileSync(filepath, Buffer.from(base64, 'base64'));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(filename);
        console.log('Screenshot saved:', filepath);
      } catch (e) {
        res.writeHead(400);
        res.end('Bad request');
      }
    });
    return;
  }

  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

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
  console.log('Press F9 in the game to save a screenshot to the screenshots/ directory.');
});