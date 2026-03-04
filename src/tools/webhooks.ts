import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../discord";
import { textResult, jsonResult, getTextChannel } from "../utils";

export function registerWebhookTools(server: McpServer) {
  server.tool(
    "create_webhook",
    "Create a webhook for a text channel",
    {
      channelId: z.string().describe("The channel ID to create the webhook in"),
      name: z.string().describe("The webhook name"),
    },
    async ({ channelId, name }) => {
      const channel = await getTextChannel(channelId);
      const webhook = await channel.createWebhook({ name });
      return jsonResult({
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        channelId: webhook.channelId,
        token: webhook.token,
      });
    }
  );

  server.tool(
    "delete_webhook",
    "Delete a webhook by ID",
    {
      webhookId: z.string().describe("The webhook ID to delete"),
    },
    async ({ webhookId }) => {
      const client = getClient();
      const webhook = await client.fetchWebhook(webhookId);
      await webhook.delete();
      return textResult(`Webhook ${webhookId} deleted successfully.`);
    }
  );

  server.tool(
    "list_webhooks",
    "List all webhooks in a channel",
    {
      channelId: z.string().describe("The channel ID to list webhooks for"),
    },
    async ({ channelId }) => {
      const channel = await getTextChannel(channelId);
      const webhooks = await channel.fetchWebhooks();
      const result = webhooks.map((w) => ({
        id: w.id,
        name: w.name,
        channelId: w.channelId,
        createdAt: w.createdAt?.toISOString(),
      }));
      return jsonResult([...result.values()]);
    }
  );

  server.tool(
    "send_webhook_message",
    "Send a message using a webhook",
    {
      webhookId: z.string().describe("The webhook ID"),
      content: z.string().describe("The message content"),
      username: z.string().optional().describe("Override the webhook's username"),
      avatarURL: z.string().optional().describe("Override the webhook's avatar URL"),
    },
    async ({ webhookId, content, username, avatarURL }) => {
      const client = getClient();
      const webhook = await client.fetchWebhook(webhookId);
      const msg = await webhook.send({
        content,
        username: username ?? undefined,
        avatarURL: avatarURL ?? undefined,
      });
      return jsonResult({ id: msg.id, channelId: msg.channelId, content: msg.content });
    }
  );
}
