import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ColorResolvable } from "discord.js";
import { resolveGuild, textResult, jsonResult } from "../utils";

export function registerRoleTools(server: McpServer) {
  server.tool(
    "list_roles",
    "List all roles in the server",
    {
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ guildId }) => {
      const guild = await resolveGuild(guildId);
      await guild.roles.fetch();
      const result = guild.roles.cache.map((r) => ({
        id: r.id,
        name: r.name,
        color: r.hexColor,
        position: r.position,
        memberCount: r.members.size,
        mentionable: r.mentionable,
        managed: r.managed,
      }));
      return jsonResult([...result.values()]);
    }
  );

  server.tool(
    "create_role",
    "Create a new role in the server",
    {
      name: z.string().describe("The role name"),
      color: z.string().optional().describe("Hex color code (e.g. #FF0000)"),
      mentionable: z.boolean().optional().describe("Whether the role is mentionable"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ name, color, mentionable, guildId }) => {
      const guild = await resolveGuild(guildId);
      const role = await guild.roles.create({
        name,
        color: (color as ColorResolvable) ?? undefined,
        mentionable: mentionable ?? undefined,
      });
      return jsonResult({ id: role.id, name: role.name, color: role.hexColor, position: role.position });
    }
  );

  server.tool(
    "edit_role",
    "Edit an existing role in the server",
    {
      roleId: z.string().describe("The role ID to edit"),
      name: z.string().optional().describe("New role name"),
      color: z.string().optional().describe("New hex color code"),
      mentionable: z.boolean().optional().describe("Whether the role is mentionable"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ roleId, name, color, mentionable, guildId }) => {
      const guild = await resolveGuild(guildId);
      const role = await guild.roles.fetch(roleId);
      if (!role) throw new Error(`Role not found: ${roleId}`);
      const edited = await role.edit({
        name: name ?? undefined,
        color: (color as ColorResolvable) ?? undefined,
        mentionable: mentionable ?? undefined,
      });
      return jsonResult({ id: edited.id, name: edited.name, color: edited.hexColor, position: edited.position });
    }
  );

  server.tool(
    "delete_role",
    "Delete a role from the server",
    {
      roleId: z.string().describe("The role ID to delete"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ roleId, guildId }) => {
      const guild = await resolveGuild(guildId);
      const role = await guild.roles.fetch(roleId);
      if (!role) throw new Error(`Role not found: ${roleId}`);
      await role.delete();
      return textResult(`Role ${roleId} deleted successfully.`);
    }
  );

  server.tool(
    "assign_role",
    "Assign a role to a user",
    {
      userId: z.string().describe("The user ID to assign the role to"),
      roleId: z.string().describe("The role ID to assign"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ userId, roleId, guildId }) => {
      const guild = await resolveGuild(guildId);
      const member = await guild.members.fetch(userId);
      await member.roles.add(roleId);
      return textResult(`Role ${roleId} assigned to user ${userId}.`);
    }
  );

  server.tool(
    "remove_role",
    "Remove a role from a user",
    {
      userId: z.string().describe("The user ID to remove the role from"),
      roleId: z.string().describe("The role ID to remove"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ userId, roleId, guildId }) => {
      const guild = await resolveGuild(guildId);
      const member = await guild.members.fetch(userId);
      await member.roles.remove(roleId);
      return textResult(`Role ${roleId} removed from user ${userId}.`);
    }
  );
}
