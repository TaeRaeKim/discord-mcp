# @taeraekim/discord-mcp

[![npm version](https://img.shields.io/npm/v/@taeraekim/discord-mcp)](https://www.npmjs.com/package/@taeraekim/discord-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green)](https://nodejs.org)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server for the Discord API using [discord.js](https://discord.js.org/) v14.
Provides 31 tools for managing Discord servers, channels, messages, users, roles, and more — all accessible from MCP-compatible clients like Claude Desktop, Claude Code, and Cursor.

## Quick Start

```bash
claude mcp add discord-mcp \
  -e DISCORD_TOKEN=your_token \
  -e DISCORD_GUILD_ID=your_guild_id \
  -- npx -y @taeraekim/discord-mcp
```

> On Windows, prefix with `cmd /c`: `-- cmd /c npx -y @taeraekim/discord-mcp`

## Installation

### Claude Code

```bash
# macOS / Linux
claude mcp add discord-mcp -e DISCORD_TOKEN=your_token -e DISCORD_GUILD_ID=your_guild_id -- npx -y @taeraekim/discord-mcp

# Windows
claude mcp add discord-mcp -e DISCORD_TOKEN=your_token -e DISCORD_GUILD_ID=your_guild_id -- cmd /c npx -y @taeraekim/discord-mcp
```

Verify with `claude mcp list`.

### Claude Desktop

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

### Cursor

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

### Docker

```bash
docker run --rm -i \
  -e DISCORD_TOKEN=your_token \
  -e DISCORD_GUILD_ID=your_guild_id \
  taerae/discord-mcp:latest
```

### From Source

```bash
git clone https://github.com/TaeRaeKim/discord-mcp.git
cd discord-mcp
npm install
cp .env.example .env   # edit .env with your token
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Discord bot token |
| `DISCORD_GUILD_ID` | No | Default guild ID. When set, `guildId` becomes optional for all tools |

## Tools

### Server Info (1)

| Tool | Description |
|------|-------------|
| `get_server_info` | Get detailed server information |

### Messages (6)

| Tool | Description |
|------|-------------|
| `send_message` | Send a message to a text channel |
| `edit_message` | Edit an existing message |
| `delete_message` | Delete a message |
| `read_messages` | Read message history from a channel |
| `add_reaction` | Add an emoji reaction to a message |
| `remove_reaction` | Remove the bot's emoji reaction |

### Users & DM (5)

| Tool | Description |
|------|-------------|
| `get_user_id_by_name` | Find a user's ID by username |
| `send_private_message` | Send a DM to a user |
| `edit_private_message` | Edit a DM sent by the bot |
| `delete_private_message` | Delete a DM sent by the bot |
| `read_private_messages` | Read DM history with a user |

### Channels (4)

| Tool | Description |
|------|-------------|
| `create_channel` | Create a new channel (text, voice, announcement, stage, or forum) |
| `delete_channel` | Delete a channel |
| `find_channel` | Find a channel by name |
| `list_channels` | List all channels in the server |

### Categories (4)

| Tool | Description |
|------|-------------|
| `create_category` | Create a new category |
| `delete_category` | Delete a category |
| `find_category` | Find a category by name |
| `list_channels_in_category` | List channels in a category |

### Webhooks (4)

| Tool | Description |
|------|-------------|
| `create_webhook` | Create a webhook on a channel |
| `delete_webhook` | Delete a webhook |
| `list_webhooks` | List webhooks on a channel |
| `send_webhook_message` | Send a message via webhook |

### Threads (1)

| Tool | Description |
|------|-------------|
| `list_active_threads` | List active threads in the server |

### Roles (6)

| Tool | Description |
|------|-------------|
| `list_roles` | List all roles in the server |
| `create_role` | Create a new role |
| `edit_role` | Edit an existing role |
| `delete_role` | Delete a role |
| `assign_role` | Assign a role to a user |
| `remove_role` | Remove a role from a user |

## Documentation

- [Setup Guide](./docs/setup.md) — Bot creation, environment setup, and detailed configuration
- [Tools Reference](./docs/tools-reference.md) — Full parameter reference for all 31 tools

## License

[MIT](LICENSE)
