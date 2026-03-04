import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { resolveGuild, jsonResult } from "../utils";

export function registerServerInfoTools(server: McpServer) {
  server.tool(
    "get_server_info",
    "Get detailed information about a Discord server (guild)",
    { guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)") },
    async ({ guildId }) => {
      const guild = await resolveGuild(guildId);
      await guild.fetch();
      const info = {
        id: guild.id,
        name: guild.name,
        description: guild.description,
        memberCount: guild.memberCount,
        ownerId: guild.ownerId,
        createdAt: guild.createdAt.toISOString(),
        icon: guild.iconURL(),
        banner: guild.bannerURL(),
        boostLevel: guild.premiumTier,
        boostCount: guild.premiumSubscriptionCount,
        verificationLevel: guild.verificationLevel,
        vanityURLCode: guild.vanityURLCode,
        features: guild.features,
      };
      return jsonResult(info);
    }
  );
}
