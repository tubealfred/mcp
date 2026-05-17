# TubeAlfred Claude Desktop Extension

Builds `tubealfred-youtube.mcpb`, the Claude Desktop extension bundle for `@tubealfred/mcp`.

## Build

```bash
pnpm build:mcpb
```

Output:

```text
mcpb/dist/tubealfred-youtube.mcpb
```

## What's Inside

- `manifest.json` declares the extension metadata, API key config, and MCP launch command.
- `server/index.js` is the bundled `@tubealfred/mcp` stdio bridge.
- `icon.png` is copied into the bundle when present.

The extension connects Claude Desktop to the hosted TubeAlfred MCP server at `https://mcp.tubealfred.com/` and exposes the same read-only YouTube tools listed in the package README.

## Install

1. Download `tubealfred-youtube.mcpb` from a release.
2. Open Claude Desktop settings.
3. Install the extension file and paste your TubeAlfred API key.
