import { getClient } from "./discord";
import { Guild, TextChannel } from "discord.js";

export function resolveGuildId(guildId?: string): string {
  const id = guildId || process.env.DISCORD_GUILD_ID;
  if (!id) {
    throw new Error(
      "guildId is required. Provide it as a parameter or set DISCORD_GUILD_ID environment variable."
    );
  }
  return id;
}

export async function resolveGuild(guildId?: string): Promise<Guild> {
  const id = resolveGuildId(guildId);
  const client = getClient();
  const guild = await client.guilds.fetch(id);
  if (!guild) {
    throw new Error(`Guild not found: ${id}`);
  }
  return guild;
}

export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function jsonResult(data: unknown) {
  return textResult(JSON.stringify(data, null, 2));
}

export async function getTextChannel(channelId: string): Promise<TextChannel> {
  const client = getClient();
  const channel = await client.channels.fetch(channelId);
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    throw new Error(`Text channel not found: ${channelId}`);
  }
  return channel as TextChannel;
}
