import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ChannelType, type GuildChannelTypes } from "discord.js";
import { getClient } from "../discord";
import { resolveGuild, textResult, jsonResult } from "../utils";

export function registerChannelTools(server: McpServer) {
  const channelTypeEnum = z.enum(["text", "voice", "announcement", "stage", "forum"])
    .describe("Channel type: text, voice, announcement, stage, or forum");

  const channelTypeMap: Record<string, GuildChannelTypes> = {
    text: ChannelType.GuildText,
    voice: ChannelType.GuildVoice,
    announcement: ChannelType.GuildAnnouncement,
    stage: ChannelType.GuildStageVoice,
    forum: ChannelType.GuildForum,
  };

  server.tool(
    "create_channel",
    "Create a new channel in the server (text, voice, announcement, stage, or forum)",
    {
      name: z.string().describe("The channel name"),
      type: channelTypeEnum.default("text"),
      categoryId: z.string().optional().describe("Parent category ID"),
      topic: z.string().optional().describe("Channel topic (text, announcement, forum)"),
      bitrate: z.number().optional().describe("Bitrate in bps for voice/stage channels (e.g. 64000)"),
      userLimit: z.number().optional().describe("User limit for voice/stage channels (0 = unlimited)"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ name, type, categoryId, topic, bitrate, userLimit, guildId }) => {
      const guild = await resolveGuild(guildId);
      const channelType = channelTypeMap[type];
      const channel = await guild.channels.create({
        name,
        type: channelType,
        parent: categoryId,
        topic: topic ?? undefined,
        bitrate: bitrate ?? undefined,
        userLimit: userLimit ?? undefined,
      });
      return jsonResult({ id: channel.id, name: channel.name, type: channel.type, parentId: channel.parentId });
    }
  );

  server.tool(
    "delete_channel",
    "Delete a channel from the server",
    {
      channelId: z.string().describe("The channel ID to delete"),
    },
    async ({ channelId }) => {
      const client = getClient();
      const channel = await client.channels.fetch(channelId);
      if (!channel) throw new Error(`Channel not found: ${channelId}`);
      if (!("delete" in channel)) throw new Error("Cannot delete this channel type");
      await (channel as any).delete();
      return textResult(`Channel ${channelId} deleted successfully.`);
    }
  );

  server.tool(
    "find_channel",
    "Find a channel by name in the server",
    {
      name: z.string().describe("The channel name to search for"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ name, guildId }) => {
      const guild = await resolveGuild(guildId);
      const channels = guild.channels.cache.filter(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (channels.size === 0) {
        return textResult(`No channel found with name: ${name}`);
      }
      const result = channels.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        parentId: c.parentId,
      }));
      return jsonResult([...result.values()]);
    }
  );

  server.tool(
    "list_channels",
    "List all channels in the server",
    {
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ guildId }) => {
      const guild = await resolveGuild(guildId);
      await guild.channels.fetch();
      const result = guild.channels.cache.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        parentId: c.parentId,
      }));
      return jsonResult([...result.values()]);
    }
  );
}
