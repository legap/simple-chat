## ADDED Requirements

### Requirement: Messages sent via STOMP WebSocket
The system SHALL use STOMP over WebSocket for sending and receiving messages in real-time.

#### Scenario: Send message to chat
- **WHEN** user sends a message
- **THEN** client SHALL send a STOMP message to `/app/chat.{chatId}`
- **AND** payload SHALL contain `{ "content": "...", "userId": ... }`

#### Scenario: Receive message from chat
- **WHEN** a message is broadcast to the chat
- **THEN** all subscribed clients SHALL receive it via `/topic/chat.{chatId}`

### Requirement: Message persistence before broadcast
The system SHALL persist the message to the database before broadcasting to subscribers.

#### Scenario: Persist message
- **WHEN** a message is received at `/app/chat.{chatId}`
- **THEN** server SHALL save it to `messages` table
- **AND** THEN broadcast to `/topic/chat.{chatId}`

### Requirement: WebSocket reconnection with exponential backoff
The system SHALL automatically reconnect WebSocket connections using exponential backoff when connections are lost.

#### Scenario: Connection lost triggers reconnection
- **WHEN** WebSocket connection is lost
- **THEN** client SHALL attempt to reconnect with exponential backoff
- **AND** maximum reconnection attempts SHALL be configurable
- **AND** UI SHALL indicate connection status during reconnection

### Requirement: Load historical messages on chat entry
The system SHALL provide a REST endpoint to load historical messages when a user enters a chat, with infinite scroll support for loading older messages.

#### Scenario: Load message history on entry
- **WHEN** user navigates to chat room
- **THEN** client SHALL fetch messages from `GET /api/chats/{chatId}/messages?before={timestamp}&limit=50`
- **AND** messages SHALL be returned in chronological order (oldest first)
- **AND** limited to last 50 messages by default

#### Scenario: Load older messages via infinite scroll
- **WHEN** user scrolls to the top of the message list
- **THEN** client SHALL fetch older messages from `GET /api/chats/{chatId}/messages?before={oldestMessageTimestamp}&limit=50`
- **AND** new messages SHALL be prepended to the existing message list

### Requirement: Message send retry on failure
The system SHALL automatically retry failed message sends with a configurable number of attempts.

#### Scenario: Retry on send failure
- **WHEN** a message send fails (e.g., network error)
- **THEN** client SHALL retry sending the message up to `messageMaxRetries` times
- **AND** between retries SHALL wait with exponential backoff
- **AND** if all retries fail, SHALL display error state on the message

#### Scenario: Configurable retry count
- **WHEN** the application is configured with `messageMaxRetries`
- **THEN** the system SHALL use that value as the maximum retry count
- **AND** default value SHALL be 3 retries if not configured
