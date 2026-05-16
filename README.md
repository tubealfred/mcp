# @tubealfred/mcp

Stdio MCP server for the [TubeAlfred YouTube API](https://tubealfred.com/docs). Bridges any MCP client that speaks stdio (Claude Desktop, Cursor, Continue, Claude Code, Zed) to the hosted streamable-HTTP server at `mcp.tubealfred.com`.

Use the same API key for the REST API at `api.tubealfred.com` and this MCP surface.

## Install

### Claude Desktop one-click extension

Download the latest Desktop Extension:

<https://github.com/tubealfred/mcp/releases/latest/download/tubealfred-youtube.dxt>

Double-click `tubealfred-youtube.dxt`, approve the Claude Desktop install prompt, then paste your TubeAlfred API key when prompted. This is the recommended path for non-terminal users.

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

Restart Claude Desktop. The TubeAlfred tools for video, transcript, comments, replies, channels, Shorts, playlists, community posts, search, hashtags, suggestions, and URL resolution will appear in the tool list.

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

Every tool published at `mcp.tubealfred.com` appears in your MCP client:

- `youtube.video.get` — video title, counts, duration, keywords, channel, and transcript metadata
- `youtube.video.transcript` — optimized transcript fetch
- `youtube.comments.list` and `youtube.comments.page` — comment pagination
- `youtube.replies.list` and `youtube.replies.page` — reply-thread pagination
- `youtube.channel.get`, `youtube.channel.about`, `youtube.channel.videos`, `youtube.channel.shorts`, `youtube.channel.playlists`, and `youtube.channel.community` — channel profile, about, video, Shorts, playlist, and community feeds
- `youtube.search.query`, `youtube.search.suggest`, and `youtube.search.hashtag` — discovery workflows
- `youtube.playlist.get` — playlist video pagination
- `youtube.url.resolve` — parse YouTube URLs into canonical IDs

Credits, rate limits, and quota are documented at <https://tubealfred.com/docs#limits>.

## License

MIT
