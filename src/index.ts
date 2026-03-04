#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initDiscord } from "./discord";
import { createMcpServer } from "./server";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Initialize Discord client
  await initDiscord();
  console.error("Discord client connected.");

  // Create and start MCP server
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on STDIO.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
