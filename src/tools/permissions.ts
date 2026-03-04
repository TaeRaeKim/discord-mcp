import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../discord";
import { textResult, jsonResult } from "../utils";
import { OverwriteType, PermissionsBitField } from "discord.js";
import type { GuildChannel } from "discord.js";

async function getGuildChannel(channelId: string): Promise<GuildChannel> {
  const client = getClient();
  const channel = await client.channels.fetch(channelId);
  if (!channel || channel.isDMBased()) {
    throw new Error(`Guild channel not found: ${channelId}`);
  }
  return channel as GuildChannel;
}

export function registerPermissionTools(server: McpServer) {
  server.tool(
    "set_channel_permission",
    "Set permission overwrite for a role or member on a channel",
    {
      channelId: z.string().describe("The channel ID to set permissions on"),
      targetId: z.string().describe("The role or user ID to set permissions for"),
      targetType: z.enum(["role", "member"]).describe("Whether the target is a role or a member"),
      allow: z
        .array(z.string())
        .optional()
        .describe("Permission flags to allow (e.g. [\"SendMessages\", \"ViewChannel\"])"),
      deny: z
        .array(z.string())
        .optional()
        .describe("Permission flags to deny (e.g. [\"SendMessages\", \"ViewChannel\"])"),
    },
    async ({ channelId, targetId, targetType, allow, deny }) => {
      const channel = await getGuildChannel(channelId);
      const type = targetType === "role" ? OverwriteType.Role : OverwriteType.Member;

      const permAllow: Record<string, boolean> = {};
      const permDeny: Record<string, boolean> = {};

      if (allow) {
        for (const perm of allow) permAllow[perm] = true;
      }
      if (deny) {
        for (const perm of deny) permDeny[perm] = false;
      }

      await channel.permissionOverwrites.edit(targetId, { ...permAllow, ...permDeny }, { type });
      return textResult(
        `Permission overwrite set for ${targetType} ${targetId} on channel ${channelId}.`
      );
    }
  );

  server.tool(
    "remove_channel_permission",
    "Remove a permission overwrite from a channel",
    {
      channelId: z.string().describe("The channel ID to remove the permission overwrite from"),
      targetId: z
        .string()
        .describe("The role or user ID whose permission overwrite should be removed"),
    },
    async ({ channelId, targetId }) => {
      const channel = await getGuildChannel(channelId);
      await channel.permissionOverwrites.delete(targetId);
      return textResult(
        `Permission overwrite for ${targetId} removed from channel ${channelId}.`
      );
    }
  );

  server.tool(
    "get_channel_permissions",
    "Get all permission overwrites for a channel",
    {
      channelId: z.string().describe("The channel ID to get permission overwrites for"),
    },
    async ({ channelId }) => {
      const channel = await getGuildChannel(channelId);
      const overwrites = channel.permissionOverwrites.cache.map((ow) => ({
        id: ow.id,
        type: ow.type === OverwriteType.Role ? "role" : "member",
        allow: new PermissionsBitField(ow.allow).toArray(),
        deny: new PermissionsBitField(ow.deny).toArray(),
      }));
      return jsonResult(overwrites);
    }
  );
}
