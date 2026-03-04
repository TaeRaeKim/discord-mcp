import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerServerInfoTools } from "./tools/server-info";
import { registerMessageTools } from "./tools/messages";
import { registerUserTools } from "./tools/users";
import { registerChannelTools } from "./tools/channels";
import { registerCategoryTools } from "./tools/categories";
import { registerWebhookTools } from "./tools/webhooks";
import { registerThreadTools } from "./tools/threads";
import { registerRoleTools } from "./tools/roles";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "discord-mcp",
    version: "1.0.0",
  });

  registerServerInfoTools(server);
  registerMessageTools(server);
  registerUserTools(server);
  registerChannelTools(server);
  registerCategoryTools(server);
  registerWebhookTools(server);
  registerThreadTools(server);
  registerRoleTools(server);

  return server;
}
