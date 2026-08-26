# @tubealfred/mcp

Stdio MCP server for the [TubeAlfred YouTube API](https://tubealfred.com/docs). Bridges any MCP client that speaks stdio (Claude Desktop, Cursor, Continue, Claude Code, Zed) to the hosted streamable-HTTP server at `mcp.tubealfred.com`.

Use the same API key for the REST API at `api.tubealfred.com` and this MCP surface.

## Agent Plugin

This repository is also a portable [Agent Plugin](https://agent-plugins.org/specification). Import or clone the repository root in a compatible client: [`plugin.json`](./plugin.json) identifies the plugin, [`mcp.json`](./mcp.json) connects the hosted Streamable HTTP server, and [`skills/`](./skills/) contains focused video, audience, and discovery research workflows.

Coding agents and contributors should read [`AGENTS.md`](./AGENTS.md) before changing generated contracts, tool metadata, or release files.

## Install

### Claude Desktop one-click extension

Download the latest Desktop Extension:

<https://github.com/tubealfred/mcp/releases/latest/download/tubealfred-youtube.mcpb>

Double-click `tubealfred-youtube.mcpb`, approve the Claude Desktop install prompt, then paste your TubeAlfred API key when prompted. This is the recommended path for non-terminal users.

For non-Claude Desktop clients, use the `npx` stdio bridge below.

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "tubealfred": {
      "command": "npx",
      "args": ["-y", "@tubealfred/mcp"],
      "env": {
        "TUBEALFRED_API_KEY": "ta_live_..."
      }
    }
  }
}
```

Restart Claude Desktop. The TubeAlfred YouTube tools for video, transcript, comments, replies, related videos, channels, streams, Shorts, playlists, community posts, search, hashtags, suggestions, trending, batch lookups, and URL resolution will appear in the tool list.

### Cursor

Settings → Cursor Settings → MCP → Add new MCP server. Paste the same JSON.

### Continue (VS Code / JetBrains)

In `~/.continue/config.json` (or per-workspace `config.yaml`):

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "@tubealfred/mcp"],
          "env": { "TUBEALFRED_API_KEY": "ta_live_..." }
        }
      }
    ]
  }
}
```

### Claude Code

```bash
claude mcp add tubealfred -- npx -y @tubealfred/mcp
```

Then export the key in the same shell:

```bash
export TUBEALFRED_API_KEY=ta_live_...
```

### Smithery

```bash
npx -y @smithery/cli install tubealfred/youtube --client claude
```

Smithery prompts for the API key and writes the config for you.

## Configuration

| Env var | Required | Description |
| --- | --- | --- |
| `TUBEALFRED_API_KEY` | yes | Your TubeAlfred team key. Create at [tubealfred.com/app/api-keys](https://tubealfred.com/app/api-keys). |
| `TUBEALFRED_MCP_URL` | no | Override the upstream MCP URL. Defaults to `https://mcp.tubealfred.com/`. |

## What you get

Every public tool published at `mcp.tubealfred.com` appears in your MCP client. The current 34-tool inventory, REST operation mapping, parameters, costs, and visibility are published in the [versioned operation manifest](https://tubealfred.com/.well-known/tubealfred-youtube-operations.v1.json); MCPB metadata is generated from its public capability set.

Credits, rate limits, and quota are documented at <https://tubealfred.com/docs#limits>.

## License

MIT
