# TubeAlfred Claude Desktop Extension

Builds `tubealfred-youtube.dxt`, the Claude Desktop extension bundle for `@tubealfred/mcp`.

## Build

```bash
pnpm build:dxt
```

Output:

```text
dxt/dist/tubealfred-youtube.dxt
```

## What's Inside

- `manifest.json` declares the extension metadata, API key config, and MCP launch command.
- `server/index.js` is the bundled `@tubealfred/mcp` stdio bridge.
- `icon.png` is copied into the bundle when present.

## Install

1. Download `tubealfred-youtube.dxt` from a release.
2. Open Claude Desktop settings.
3. Install the extension file and paste your TubeAlfred API key.
