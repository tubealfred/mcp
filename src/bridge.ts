import type { JSONRPCMessage, JSONRPCRequest } from "@modelcontextprotocol/sdk/types.js";

export const RECONNECT_BASE_DELAY_MS = 1_000;
export const RECONNECT_MAX_DELAY_MS = 30_000;

export const reconnectDelayMs = (attempt: number): number => {
  const safeAttempt = Math.max(0, Math.floor(attempt));
  return Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * 2 ** safeAttempt);
};

export const isJsonRpcRequest = (message: JSONRPCMessage): message is JSONRPCRequest =>
  typeof message === "object" && message !== null && "id" in message && "method" in message;

/**
 * Synthesize a JSON-RPC error response for a request that never reached the
 * upstream. Without this the client waits until its own timeout and reports
 * a hang instead of a recoverable error.
 */
export const bridgeErrorResponse = (id: string | number, reason: string): JSONRPCMessage => ({
  jsonrpc: "2.0",
  id,
  error: {
    code: -32000,
    message: reason,
  },
});
