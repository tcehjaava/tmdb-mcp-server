# TMDB MCP Server - Transport Configuration

This server supports **dual transport modes**: stdio (local) and Streamable HTTP (remote).

## Transport Modes

### stdio Mode (Default) - For Local Use

Best for: Claude Desktop, Cursor IDE, local development

**Configuration:**
```bash
MCP_TRANSPORT=stdio  # or omit entirely (stdio is default)
```

**Start server:**
```bash
npm run build
node build/index.js
```

**Output:**
```
==================================================
TMDB MCP Server
==================================================
Transport mode: stdio
Node environment: development
==================================================
TMDB MCP Server running on stdio
Ready for Claude Desktop connection
```

**Claude Desktop Configuration:**
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "tmdb": {
      "command": "node",
      "args": ["/Users/tejachava/Projects/tmdb-mcp-server/build/index.js"],
      "env": {
        "TMDB_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

---

### HTTP Mode (Streamable HTTP) - For Remote Deployment

Best for: Railway, cloud hosting, remote access, multiple users

**Configuration:**
```bash
MCP_TRANSPORT=http
PORT=3000  # optional, defaults to 3000
```

**Start server:**
```bash
MCP_TRANSPORT=http PORT=3000 node build/index.js
```

**Output:**
```
==================================================
TMDB MCP Server
==================================================
Transport mode: http
Node environment: production
==================================================
TMDB MCP Server running on HTTP
Port: 3000
MCP endpoint: http://localhost:3000/mcp
Health check: http://localhost:3000/health
Ready for remote MCP connections
```

**Available Endpoints:**
- `POST /mcp` - MCP protocol endpoint (Streamable HTTP)
- `GET /mcp` - MCP protocol endpoint (Streamable HTTP)
- `GET /health` - Health check

**Test health endpoint:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "server": "tmdb-mcp-server",
  "version": "0.1.0",
  "transport": "streamable-http"
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TMDB_ACCESS_TOKEN` | ✅ Yes | - | TMDB API Bearer token |
| `MCP_TRANSPORT` | No | `stdio` | Transport mode: `stdio` or `http` |
| `PORT` | No | `3000` | HTTP server port (http mode only) |
| `NODE_ENV` | No | `production` | Node environment |

---

## Railway Deployment

**1. Update .env on Railway:**
```env
TMDB_ACCESS_TOKEN=your_token_here
MCP_TRANSPORT=http
NODE_ENV=production
# PORT is automatically set by Railway
```

**2. Railway will automatically:**
- Detect Node.js project
- Run `npm install`
- Run `npm run build` (via prepare script)
- Start with `node build/index.js`
- Assign a port and domain

**3. Your server will be available at:**
```
https://your-app.railway.app/mcp
```

---

## Testing

### stdio Mode
```bash
# Terminal 1: Start server
npm run build && node build/index.js

# Terminal 2: Test with MCP Inspector
npm run inspector
```

### HTTP Mode
```bash
# Terminal 1: Start HTTP server
MCP_TRANSPORT=http npm run build && node build/index.js

# Terminal 2: Test health
curl http://localhost:3000/health

# Test MCP endpoint (requires MCP client)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

---

## Architecture

### stdio Transport
```
Claude Desktop ←→ stdin/stdout ←→ MCP Server ←→ TMDB API
```

### HTTP Transport (Streamable HTTP)
```
MCP Client ←→ HTTP /mcp ←→ Express ←→ MCP Server ←→ TMDB API
                ↓
        Session Management
        Request ID Handling
```

**Key Features:**
- Single endpoint (`/mcp`) for all MCP operations
- Automatic session ID generation (UUID)
- JSON response support
- Error handling and logging
- Health check endpoint

---

## Troubleshooting

### stdio mode not connecting
- Check Claude Desktop config path
- Verify executable permission: `chmod +x build/index.js`
- Check logs in Claude Desktop

### HTTP mode connection issues
- Verify port is not in use: `lsof -i :3000`
- Check firewall settings
- Test health endpoint first
- Review server logs

### TMDB API errors
- Verify `TMDB_ACCESS_TOKEN` is set
- Check token hasn't expired
- Test token directly: `curl -H "Authorization: Bearer YOUR_TOKEN" https://api.themoviedb.org/3/movie/550`
