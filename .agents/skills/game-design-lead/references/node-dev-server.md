# Node.js Dev Server with Live Reload

For web game development, replace python http.server with Node.js + WebSocket for auto-refresh.

## server.js template

Save as `server.js` in project root. Requires: `npm init -y && npm install ws`

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 8090;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MIME = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png' };
const RELOAD = '<script>(function(){const ws=new WebSocket("ws://"+location.host);ws.onmessage=function(e){if(e.data==="reload")location.reload()};ws.onclose=function(){setTimeout(()=>location.reload(),1000)}})();</script>';

const server = http.createServer((req, res) => {
  const fp = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(fp).toLowerCase();
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    if (ext === '.html') data = data.toString().replace('</body>', RELOAD + '</body>');
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });
let t = null;
fs.watch(PUBLIC_DIR, { recursive: true }, (_, f) => {
  if (f && (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.css'))) {
    clearTimeout(t);
    t = setTimeout(() => wss.clients.forEach(c => { if (c.readyState === 1) c.send('reload'); }), 100);
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`Live reload server: http://127.0.0.1:${PORT}`));
```

## Benefits

- Auto-refresh browser on file edit
- Injectable middleware (Tab preventDefault, etc.)
- Same JS language as game
- Tailscale compatible (bind 127.0.0.1, proxy via tailscale serve)
