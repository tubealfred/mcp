import { realpathSync } from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import packageJson from "../package.json";
import { bridgeErrorResponse, isJsonRpcRequest, reconnectDelayMs } from "./bridge.js";

export { bridgeErrorResponse, isJsonRpcRequest, reconnectDelayMs } from "./bridge.js";

const PRODUCT_NAME = "TubeAlfred YouTube MCP";
const PACKAGE_VERSION = packageJson.version;
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

  const log = (message: string): void => {
    process.stderr.write(`[${PRODUCT_NAME}] ${message}\n`);
  };

  const local = new StdioServerTransport();

  let remote: StreamableHTTPClientTransport | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let isClosing = false;

  const forwardToClient = (message: JSONRPCMessage): void => {
    local.send(message).catch((error: unknown) => {
      log(`failed to forward to stdio client: ${String(error)}`);
    });
  };

  const failRequest = (message: JSONRPCMessage, reason: string): void => {
    if (!isJsonRpcRequest(message)) {
      return;
    }

    forwardToClient(bridgeErrorResponse(message.id, reason));
  };

  const scheduleReconnect = (): void => {
    if (isClosing || reconnectTimer !== null) {
      return;
    }

    const delay = reconnectDelayMs(reconnectAttempts);
    reconnectAttempts += 1;
    log(`reconnecting to ${mcpUrl.host} in ${delay}ms (attempt ${reconnectAttempts})`);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect().catch((error: unknown) => {
        log(`reconnect failed: ${String(error)}`);
        scheduleReconnect();
      });
    }, delay);
  };

  const connect = async (): Promise<void> => {
    const transport = new StreamableHTTPClientTransport(mcpUrl, {
      requestInit: {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": `tubealfred-mcp/${PACKAGE_VERSION} (node ${process.versions.node})`,
        },
      },
    });

    transport.onmessage = forwardToClient;
    transport.onclose = () => {
      if (remote === transport) {
        remote = null;
      }

      if (!isClosing) {
        log("remote connection closed");
        scheduleReconnect();
      }
    };
    transport.onerror = (error) => {
      log(`remote error: ${String(error)}`);
    };

    await transport.start();
    remote = transport;
    reconnectAttempts = 0;
  };

  const shutdown = (reason: string): void => {
    if (isClosing) {
      return;
    }
    isClosing = true;
    log(`shutting down (${reason})`);

    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    const active = remote;
    remote = null;
    Promise.allSettled([local.close(), active?.close()]).finally(() => {
      process.exit(0);
    });
  };

  local.onmessage = (message: JSONRPCMessage) => {
    const active = remote;

    if (active === null) {
      failRequest(message, `not connected to ${mcpUrl.host}; retry the request in a moment`);

      return;
    }

    active.send(message).catch((error: unknown) => {
      log(`failed to forward to ${mcpUrl.host}: ${String(error)}`);
      failRequest(message, `failed to reach ${mcpUrl.host}: ${String(error)}`);

      if (remote === active) {
        remote = null;
        active.close().catch(() => undefined);
        scheduleReconnect();
      }
    });
  };

  local.onclose = () => shutdown("stdio closed");

  local.onerror = (error) => {
    log(`stdio error: ${String(error)}`);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  await connect();
  await local.start();
}

const invokedAsScript = ((): boolean => {
  const entry = process.argv[1];

  if (!entry) {
    return false;
  }

  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href;
  } catch {
    return false;
  }
})();

if (invokedAsScript) {
  main().catch((error: unknown) => {
    exitWithError(`Fatal: ${String(error)}`);
  });
}
