"use server";

import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  experimental_createMCPClient,
  experimental_MCPClient,
} from "@ai-sdk/mcp";

// Cache for MCP clients by session ID
const clientCache = new Map<
  string,
  {
    client: experimental_MCPClient;
    transport: StreamableHTTPClientTransport;
  }
>();

export async function getClient(sessionId?: string) {
  if (!process.env.MCP_SERVER_URL) {
    throw new Response("MCP_SERVER_URL is not set", { status: 500 });
  }

  let transport: StreamableHTTPClientTransport;
  let client: experimental_MCPClient;

  // Reuse cached client if available
  if (sessionId && clientCache.has(sessionId)) {
    const cached = clientCache.get(sessionId)!;
    transport = cached.transport;
    client = cached.client;
  } else {
    // Create new transport + client
    transport = new StreamableHTTPClientTransport(
      new URL(process.env.MCP_SERVER_URL),
      {}
    );

    client = await experimental_createMCPClient({
      transport,
    });

    if (!transport.sessionId) {
      throw new Error("Transport did not provide a sessionId");
    }

    clientCache.set(transport.sessionId, { client, transport });
    sessionId = transport.sessionId;
  }

  return { client, sessionId };
}
