# WSL Game Server Hosting Pattern

Pattern for serving a local game/server from WSL to the tailnet.

## The Setup

```bash
# 1. Start a local HTTP server in the project directory
cd /path/to/project/public
python3 -m http.server 8090 --bind 127.0.0.1

# 2. In another terminal, set up Tailscale serve to proxy it
tailscale serve --http 8090

# 3. Verify
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8090/
# Should return 200
```

## Key Points

- `tailscale serve --http <port>` proxies an **existing** local server. It does NOT start one.
- The local server must be running FIRST before tailscale serve can proxy it.
- Use `--bind 127.0.0.1` to prevent direct external access (only tailscale serve reaches it).
- Tailscale serve status: `tailscale serve status --json`
- The game is accessible at `http://<tailscale-hostname>:<port>` (e.g., `http://omega2-1.tail62bd55.ts.net:8090`)

## Common Mistakes

- **Using `npx tailscale`**: Tailscale is `/usr/bin/tailscale`, not an npx package.
- **Forgetting to start the local server**: tailscale serve returns 502 if nothing is listening on the target port.
- **Using `--https` flag**: For local development, `--http` is simpler. HTTPS requires cert configuration.
- **Port already in use**: Check with `ss -tlnp | grep <port>` before starting.

## Verification

```bash
# Check what's listening
ss -tlnp | grep 8090

# Check tailscale serve mapping
tailscale serve status

# Test locally
curl -s http://127.0.0.1:8090/ | head -20

# Test via tailnet (from another device or the WSL host itself)
curl -s http://omega2-1.tail62bd55.ts.net:8090/ | head -20
```
