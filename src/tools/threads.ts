import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { resolveGuild, jsonResult } from "../utils";

export function registerThreadTools(server: McpServer) {
  server.tool(
    "list_active_threads",
    "List all active threads in the server",
    {
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ guildId }) => {
      const guild = await resolveGuild(guildId);
      const { threads } = await guild.channels.fetchActiveThreads();
      const result = threads.map((t) => ({
        id: t.id,
        name: t.name,
        parentId: t.parentId,
        messageCount: t.messageCount,
        memberCount: t.memberCount,
        archived: t.archived,
        createdAt: t.createdAt?.toISOString(),
      }));
      return jsonResult([...result.values()]);
    }
  );
}
