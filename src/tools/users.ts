import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../discord";
import { resolveGuild, textResult, jsonResult } from "../utils";

export function registerUserTools(server: McpServer) {
  server.tool(
    "get_user_id_by_name",
    "Find a user's ID by their username in a guild",
    {
      username: z.string().describe("The username to search for"),
      guildId: z.string().optional().describe("Guild ID (uses DISCORD_GUILD_ID env if omitted)"),
    },
    async ({ username, guildId }) => {
      const guild = await resolveGuild(guildId);
      const members = await guild.members.fetch({ query: username, limit: 10 });
      const matches = members
        .filter((m) => m.user.username.toLowerCase() === username.toLowerCase() || m.displayName.toLowerCase() === username.toLowerCase())
        .map((m) => ({ id: m.user.id, username: m.user.username, displayName: m.displayName }));
      if (matches.length === 0) {
        return textResult(`No user found with username: ${username}`);
      }
      return jsonResult(matches);
    }
  );

  server.tool(
    "send_private_message",
    "Send a direct message to a user",
    {
      userId: z.string().describe("The user ID to send DM to"),
      content: z.string().describe("The message content"),
    },
    async ({ userId, content }) => {
      const client = getClient();
      const user = await client.users.fetch(userId);
      const msg = await user.send(content);
      return jsonResult({ id: msg.id, channelId: msg.channelId, content: msg.content });
    }
  );

  server.tool(
    "edit_private_message",
    "Edit a direct message sent by the bot",
    {
      userId: z.string().describe("The user ID of the DM recipient"),
      messageId: z.string().describe("The message ID to edit"),
      content: z.string().describe("The new message content"),
    },
    async ({ userId, messageId, content }) => {
      const client = getClient();
      const user = await client.users.fetch(userId);
      const dmChannel = await user.createDM();
      const msg = await dmChannel.messages.fetch(messageId);
      const edited = await msg.edit(content);
      return jsonResult({ id: edited.id, channelId: edited.channelId, content: edited.content });
    }
  );

  server.tool(
    "delete_private_message",
    "Delete a direct message sent by the bot",
    {
      userId: z.string().describe("The user ID of the DM recipient"),
      messageId: z.string().describe("The message ID to delete"),
    },
    async ({ userId, messageId }) => {
      const client = getClient();
      const user = await client.users.fetch(userId);
      const dmChannel = await user.createDM();
      const msg = await dmChannel.messages.fetch(messageId);
      await msg.delete();
      return textResult(`DM message ${messageId} deleted successfully.`);
    }
  );

  server.tool(
    "read_private_messages",
    "Read direct message history with a user",
    {
      userId: z.string().describe("The user ID to read DM history with"),
      limit: z.number().min(1).max(100).optional().describe("Number of messages to fetch (1-100, default 50)"),
    },
    async ({ userId, limit }) => {
      const client = getClient();
      const user = await client.users.fetch(userId);
      const dmChannel = await user.createDM();
      const messages = await dmChannel.messages.fetch({ limit: limit ?? 50 });
      const result = messages.map((m) => ({
        id: m.id,
        author: { id: m.author.id, username: m.author.username },
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      }));
      return jsonResult(result);
    }
  );
}
