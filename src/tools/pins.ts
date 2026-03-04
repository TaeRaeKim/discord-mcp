import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { textResult, jsonResult, getTextChannel } from "../utils";

export function registerPinTools(server: McpServer) {
  server.tool(
    "pin_message",
    "Pin a message in a Discord text channel",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to pin"),
    },
    async ({ channelId, messageId }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      await msg.pin();
      return textResult(`Message ${messageId} pinned successfully.`);
    }
  );

  server.tool(
    "unpin_message",
    "Unpin a message in a Discord text channel",
    {
      channelId: z.string().describe("The channel ID containing the message"),
      messageId: z.string().describe("The message ID to unpin"),
    },
    async ({ channelId, messageId }) => {
      const channel = await getTextChannel(channelId);
      const msg = await channel.messages.fetch(messageId);
      await msg.unpin();
      return textResult(`Message ${messageId} unpinned successfully.`);
    }
  );

  server.tool(
    "list_pinned_messages",
    "List all pinned messages in a Discord text channel",
    {
      channelId: z.string().describe("The channel ID to list pinned messages from"),
    },
    async ({ channelId }) => {
      const channel = await getTextChannel(channelId);
      const pinned = await channel.messages.fetchPinned();
      const result = pinned.map((m) => ({
        id: m.id,
        author: { id: m.author.id, username: m.author.username },
        content: m.content,
        pinnedAt: m.editedAt?.toISOString() ?? m.createdAt.toISOString(),
      }));
      return jsonResult(result);
    }
  );
}
