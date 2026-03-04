# Setup Guide

## Prerequisites

- Node.js 18 or later
- Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))

## 1. Discord Bot Setup

### Create a Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and create a new Application
2. Navigate to the **Bot** tab and copy the bot token
3. Enable these Privileged Gateway Intents in the **Bot** tab:
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`

### Invite the Bot

Generate an invite URL in OAuth2 URL Generator:
- Scope: `bot`
- Permissions: `Administrator` (or select individual permissions as needed)

Invite URL format:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

## 2. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Discord bot token |
| `DISCORD_GUILD_ID` | No | Default guild ID. When set, `guildId` becomes optional for all tools |

> **Finding Guild ID**: Enable Developer Mode in Discord Settings > Advanced, then right-click the server name > "Copy Server ID"

## 3. MCP Client Configuration

### npx (Recommended)

No local installation needed. The published npm package is used directly.

#### Claude Code (CLI)

```bash
# macOS / Linux
claude mcp add discord-mcp -e DISCORD_TOKEN=your_token -e DISCORD_GUILD_ID=your_guild_id -- npx -y @taeraekim/discord-mcp

# Windows
claude mcp add discord-mcp -e DISCORD_TOKEN=your_token -e DISCORD_GUILD_ID=your_guild_id -- cmd /c npx -y @taeraekim/discord-mcp
```

Verify: `claude mcp list`

#### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "@taeraekim/discord-mcp"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_GUILD_ID": "your_guild_id"
      }
    }
  }
}
```

> On Windows, use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "@taeraekim/discord-mcp"]`.

#### Claude Code (Config File)

Add to `.claude/settings.json` or `.mcp.json` in the project root:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "@taeraekim/discord-mcp"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_GUILD_ID": "your_guild_id"
      }
    }
  }
}
```

> On Windows, use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "@taeraekim/discord-mcp"]`.

#### Cursor

Add to `~/.cursor/mcp.json` or `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "@taeraekim/discord-mcp"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_GUILD_ID": "your_guild_id"
      }
    }
  }
}
```

See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

### Docker

```bash
docker run --rm -i \
  -e DISCORD_TOKEN=your_token \
  -e DISCORD_GUILD_ID=your_guild_id \
  taeraekim/discord-mcp:latest
```

Or in your MCP client config:

```json
{
  "mcpServers": {
    "discord": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "DISCORD_TOKEN=your_token",
        "-e", "DISCORD_GUILD_ID=your_guild_id",
        "taeraekim/discord-mcp:latest"
      ]
    }
  }
}
```

### From Source

```bash
git clone https://github.com/TaeRaeKim/discord-mcp.git
cd discord-mcp
npm install
```

Create a `.env` file:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_default_guild_id_here
```

```bash
npm run build
npm start
```

#### Local Build — Claude Desktop

```json
{
  "mcpServers": {
    "discord": {
      "command": "node",
      "args": ["/path/to/discord-mcp/dist/index.js"],
      "env": {
        "DISCORD_TOKEN": "your_token",
        "DISCORD_GUILD_ID": "your_guild_id"
      }
    }
  }
}
```

#### Local Build — Claude Code

```bash
claude mcp add discord-mcp -e DISCORD_TOKEN=your_token -e DISCORD_GUILD_ID=your_guild_id -- node /path/to/discord-mcp/dist/index.js
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `DISCORD_TOKEN environment variable is required` | Check that `.env` contains a valid token |
| `Guild not found` | Verify `DISCORD_GUILD_ID` and that the bot has joined the server |
| `Missing Intents` | Enable Privileged Intents in the Developer Portal |
| `Missing Permissions` | Ensure the bot has the required permissions |
