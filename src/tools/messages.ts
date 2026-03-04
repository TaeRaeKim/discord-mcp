import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../discord";
import { textResult, jsonResult, getTextChannel } from "../utils";

export function registerMessageTools(server: McpServer) {
  server.tool(
    "send_message",
    "Send a message to a Discord text channel",
    {
      channelId: z.string().describe("The channel ID to send the message to"),
      content: z.string().describe("The message content"),
    },
    async ({ channelId, content }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.send(content);
      return jsonResult({ id: msg.id, channelId: msg.channelId, content: msg.content });
    }
  );

  server.tool(
    "edit_message",
    "Edit an existing message in a Discord text channel",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to edit"),
      content: z.string().describe("The new message content"),
    },
    async ({ channelId, messageId, content }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      const edited = await msg.edit(content);
      return jsonResult({ id: edited.id, channelId: edited.channelId, content: edited.content });
    }
  );

  server.tool(
    "delete_message",
    "Delete a message from a Discord text channel",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to delete"),
    },
    async ({ channelId, messageId }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      await msg.delete();
      return textResult(`Message ${messageId} deleted successfully.`);
    }
  );

  server.tool(
    "read_messages",
    "Read message history from a Discord text channel",
    {
      channelId: z.string().describe("The channel ID to read messages from"),
      limit: z.number().min(1).max(100).optional().describe("Number of messages to fetch (1-100, default 50)"),
    },
    async ({ channelId, limit }) => {
      const channel = await getTextChannel(channelId);
      const messages = await channel.messages.fetch({ limit: limit ?? 50 });
      const result = messages.map((m) => ({
        id: m.id,
        author: { id: m.author.id, username: m.author.username },
        content: m.content,
        createdAt: m.createdAt.toISOString(),
        attachments: m.attachments.map((a) => ({ name: a.name, url: a.url })),
      }));
      return jsonResult(result);
    }
  );

  server.tool(
    "add_reaction",
    "Add an emoji reaction to a message",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to react to"),
      emoji: z.string().describe("The emoji to react with (Unicode emoji or custom emoji format)"),
    },
    async ({ channelId, messageId, emoji }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      await msg.react(emoji);
      return textResult(`Reaction ${emoji} added to message ${messageId}.`);
    }
  );

  server.tool(
    "remove_reaction",
    "Remove the bot's emoji reaction from a message",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to remove reaction from"),
      emoji: z.string().describe("The emoji to remove (Unicode emoji or custom emoji format)"),
    },
    async ({ channelId, messageId, emoji }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      const client = getClient();
      await msg.reactions.cache.get(emoji)?.users.remove(client.user!.id);
      return textResult(`Reaction ${emoji} removed from message ${messageId}.`);
    }
  );
}
