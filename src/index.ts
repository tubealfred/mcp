import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

const PRODUCT_NAME = "TubeAlfred YouTube MCP";
const PACKAGE_VERSION = "0.1.0";
const DEFAULT_MCP_URL = "https://mcp.tubealfred.com/";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined || value === "") {
    return undefined;
  }
  return value;
}

function exitWithError(message: string): never {
  process.stderr.write(`[${PRODUCT_NAME}] ${message}\n`);
  process.exit(1);
}

async function main(): Promise<void> {
  const apiKey = readEnv("TUBEALFRED_API_KEY") ?? readEnv("TUBE_ALFRED_API_KEY");

  if (!apiKey) {
    exitWithError(
      "Missing TUBEALFRED_API_KEY. Generate one at https://tubealfred.com/app/api-keys and pass it as an environment variable to this MCP server.",
    );
  }

  const overrideUrl = readEnv("TUBEALFRED_MCP_URL");
  let mcpUrl: URL;
  try {
    mcpUrl = new URL(overrideUrl ?? DEFAULT_MCP_URL);
  } catch {
    exitWithError(`Invalid TUBEALFRED_MCP_URL: ${overrideUrl ?? DEFAULT_MCP_URL}`);
  }

  const remote = new StreamableHTTPClientTransport(mcpUrl, {
    requestInit: {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": `tubealfred-mcp/${PACKAGE_VERSION} (node ${process.versions.node})`,
      },
    },
  });

  const local = new StdioServerTransport();

  let isClosing = false;
  const shutdown = (reason: string): void => {
    if (isClosing) {
      return;
    }
    isClosing = true;
    process.stderr.write(`[${PRODUCT_NAME}] shutting down (${reason})\n`);
    Promise.allSettled([local.close(), remote.close()]).finally(() => {
      process.exit(0);
    });
  };

  local.onmessage = (message: JSONRPCMessage) => {
    remote.send(message).catch((error: unknown) => {
      process.stderr.write(
        `[${PRODUCT_NAME}] failed to forward to ${mcpUrl.host}: ${String(error)}\n`,
      );
    });
  };

  remote.onmessage = (message: JSONRPCMessage) => {
    local.send(message).catch((error: unknown) => {
      process.stderr.write(
        `[${PRODUCT_NAME}] failed to forward to stdio client: ${String(error)}\n`,
      );
    });
  };

  local.onclose = () => shutdown("stdio closed");
  remote.onclose = () => shutdown("remote closed");

  local.onerror = (error) => {
    process.stderr.write(`[${PRODUCT_NAME}] stdio error: ${String(error)}\n`);
  };
  remote.onerror = (error) => {
    process.stderr.write(`[${PRODUCT_NAME}] remote error: ${String(error)}\n`);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  await remote.start();
  await local.start();
}

main().catch((error: unknown) => {
  exitWithError(`Fatal: ${String(error)}`);
});
