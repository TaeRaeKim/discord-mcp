# 도구 레퍼런스

Discord MCP 서버가 제공하는 27개 도구의 전체 레퍼런스입니다.

> 모든 `guildId` 파라미터는 선택사항이며, 생략 시 환경변수 `DISCORD_GUILD_ID` 값을 사용합니다.

---

## Server (1개)

### `get_server_info`
서버(길드)의 상세 정보를 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `guildId` | string | X | 길드 ID |

**응답**: 서버 이름, 멤버 수, 부스트 레벨, 기능 목록 등

---

## Messages (6개)

### `send_message`
텍스트 채널에 메시지를 전송합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `content` | string | O | 메시지 내용 |

### `edit_message`
기존 메시지를 수정합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `messageId` | string | O | 메시지 ID |
| `content` | string | O | 새 메시지 내용 |

### `delete_message`
메시지를 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `messageId` | string | O | 메시지 ID |

### `read_messages`
채널의 메시지 히스토리를 읽습니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `limit` | number | X | 가져올 메시지 수 (1-100, 기본값 50) |

### `add_reaction`
메시지에 이모지 리액션을 추가합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `messageId` | string | O | 메시지 ID |
| `emoji` | string | O | 이모지 (유니코드 또는 커스텀 이모지) |

### `remove_reaction`
봇의 이모지 리액션을 제거합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `messageId` | string | O | 메시지 ID |
| `emoji` | string | O | 이모지 |

---

## Users & DM (5개)

### `get_user_id_by_name`
유저 이름으로 ID를 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `username` | string | O | 검색할 유저 이름 |
| `guildId` | string | X | 길드 ID |

### `send_private_message`
사용자에게 DM을 전송합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `content` | string | O | 메시지 내용 |

### `edit_private_message`
봇이 보낸 DM을 수정합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `messageId` | string | O | 메시지 ID |
| `content` | string | O | 새 메시지 내용 |

### `delete_private_message`
봇이 보낸 DM을 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `messageId` | string | O | 메시지 ID |

### `read_private_messages`
사용자와의 DM 히스토리를 읽습니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `limit` | number | X | 가져올 메시지 수 (1-100, 기본값 50) |

---

## Channels (4개)

### `create_text_channel`
텍스트 채널을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | O | 채널 이름 |
| `categoryId` | string | X | 상위 카테고리 ID |
| `topic` | string | X | 채널 주제 |
| `guildId` | string | X | 길드 ID |

### `delete_channel`
채널을 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |

### `find_channel`
이름으로 채널을 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | O | 채널 이름 |
| `guildId` | string | X | 길드 ID |

### `list_channels`
서버의 전체 채널 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `guildId` | string | X | 길드 ID |

---

## Categories (4개)

### `create_category`
카테고리를 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | O | 카테고리 이름 |
| `guildId` | string | X | 길드 ID |

### `delete_category`
카테고리를 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `categoryId` | string | O | 카테고리 ID |

### `find_category`
이름으로 카테고리를 검색합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | O | 카테고리 이름 |
| `guildId` | string | X | 길드 ID |

### `list_channels_in_category`
카테고리 내 채널 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `categoryId` | string | O | 카테고리 ID |
| `guildId` | string | X | 길드 ID |

---

## Webhooks (4개)

### `create_webhook`
채널에 웹훅을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |
| `name` | string | O | 웹훅 이름 |

### `delete_webhook`
웹훅을 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `webhookId` | string | O | 웹훅 ID |

### `list_webhooks`
채널의 웹훅 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `channelId` | string | O | 채널 ID |

### `send_webhook_message`
웹훅으로 메시지를 전송합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `webhookId` | string | O | 웹훅 ID |
| `content` | string | O | 메시지 내용 |
| `username` | string | X | 웹훅 사용자 이름 오버라이드 |
| `avatarURL` | string | X | 웹훅 아바타 URL 오버라이드 |

---

## Threads (1개)

### `list_active_threads`
서버의 활성 쓰레드 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `guildId` | string | X | 길드 ID |

---

## Roles (6개)

### `list_roles`
서버의 역할 목록을 조회합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `guildId` | string | X | 길드 ID |

### `create_role`
새 역할을 생성합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `name` | string | O | 역할 이름 |
| `color` | string | X | 색상 코드 (예: `#FF0000`) |
| `mentionable` | boolean | X | 멘션 가능 여부 |
| `guildId` | string | X | 길드 ID |

### `edit_role`
기존 역할을 수정합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `roleId` | string | O | 역할 ID |
| `name` | string | X | 새 역할 이름 |
| `color` | string | X | 새 색상 코드 |
| `mentionable` | boolean | X | 멘션 가능 여부 |
| `guildId` | string | X | 길드 ID |

### `delete_role`
역할을 삭제합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `roleId` | string | O | 역할 ID |
| `guildId` | string | X | 길드 ID |

### `assign_role`
사용자에게 역할을 부여합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `roleId` | string | O | 역할 ID |
| `guildId` | string | X | 길드 ID |

### `remove_role`
사용자에서 역할을 제거합니다.

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `userId` | string | O | 사용자 ID |
| `roleId` | string | O | 역할 ID |
| `guildId` | string | X | 길드 ID |
