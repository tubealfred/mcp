import assert from "node:assert/strict";
import { test } from "node:test";

import {
  bridgeErrorResponse,
  isJsonRpcRequest,
  reconnectDelayMs,
} from "../dist/index.js";

test("reconnectDelayMs doubles from 1s and caps at 30s", () => {
  assert.equal(reconnectDelayMs(0), 1_000);
  assert.equal(reconnectDelayMs(1), 2_000);
  assert.equal(reconnectDelayMs(2), 4_000);
  assert.equal(reconnectDelayMs(4), 16_000);
  assert.equal(reconnectDelayMs(5), 30_000);
  assert.equal(reconnectDelayMs(20), 30_000);
});

test("reconnectDelayMs tolerates negative and fractional attempts", () => {
  assert.equal(reconnectDelayMs(-3), 1_000);
  assert.equal(reconnectDelayMs(1.9), 2_000);
});

test("isJsonRpcRequest only matches messages with both id and method", () => {
  assert.equal(
    isJsonRpcRequest({ jsonrpc: "2.0", id: 1, method: "tools/call", params: {} }),
    true,
  );
  assert.equal(
    isJsonRpcRequest({ jsonrpc: "2.0", method: "notifications/initialized" }),
    false,
  );
  assert.equal(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, result: {} }), false);
  assert.equal(isJsonRpcRequest({ jsonrpc: "2.0", id: 1, error: { code: -1, message: "x" } }), false);
});

test("bridgeErrorResponse echoes the request id with a JSON-RPC error", () => {
  const response = bridgeErrorResponse("call-1", "failed to reach mcp.tubealfred.com");

  assert.equal(response.jsonrpc, "2.0");
  assert.equal(response.id, "call-1");
  assert.equal(response.error.code, -32000);
  assert.match(response.error.message, /mcp\.tubealfred\.com/);
});
