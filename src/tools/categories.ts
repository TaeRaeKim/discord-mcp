import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ChannelType } from "discord.js";
import { getClient } from "../discord";
import { resolveGuild, textResult, jsonResult } from "../utils";

export function registerCategoryTools(server: McpServer) {
  server.tool(
    "create_category",
    "Create a new category in the server",
    {
      name: z.string().describe("The category name"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ name, guildId }) => {
      const guild = await resolveGuild(guildId);
      const category = await guild.channels.create({
        name,
        type: ChannelType.GuildCategory,
      });
      return jsonResult({ id: category.id, name: category.name, type: category.type });
    }
  );

  server.tool(
    "delete_category",
    "Delete a category from the server",
    {
      categoryId: z.string().describe("The category ID to delete"),
    },
    async ({ categoryId }) => {
      const client = getClient();
      const channel = await client.channels.fetch(categoryId);
      if (!channel || channel.type !== ChannelType.GuildCategory) {
        throw new Error(`Category not found: ${categoryId}`);
      }
      await channel.delete();
      return textResult(`Category ${categoryId} deleted successfully.`);
    }
  );

  server.tool(
    "find_category",
    "Find a category by name in the server",
    {
      name: z.string().describe("The category name to search for"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ name, guildId }) => {
      const guild = await resolveGuild(guildId);
      const categories = guild.channels.cache.filter(
        (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === name.toLowerCase()
      );
      if (categories.size === 0) {
        return textResult(`No category found with name: ${name}`);
      }
      const result = categories.map((c) => ({ id: c.id, name: c.name }));
      return jsonResult([...result.values()]);
    }
  );

  server.tool(
    "list_channels_in_category",
    "List all channels within a specific category",
    {
      categoryId: z.string().describe("The category ID"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ categoryId, guildId }) => {
      const guild = await resolveGuild(guildId);
      const channels = guild.channels.cache.filter((c) => c.parentId === categoryId);
      const result = channels.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        position: "position" in c ? c.position : undefined,
      }));
      return jsonResult([...result.values()]);
    }
  );
}
