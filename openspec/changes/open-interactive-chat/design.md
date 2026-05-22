## Context

The chat room page (`/chats/{id}`) is currently a placeholder. The chat list page exists and allows creating/selecting chats, but no actual messaging functionality exists. WebSocket infrastructure is partially in place via WebSocketConfig.java.

## Goals / Non-Goals

**Goals:**
- Display chat messages in chronological order
- Show member list on the right side of the chat view
- Send messages via WebSocket and receive in real-time
- Allow users to leave a chat and return to chat list
- Auto-join chat when navigating to chat room

**Non-Goals:**
- Private/direct messaging
- Message editing or deletion
- Typing indicators
- Message search

## Decisions

### Decision 1: Message Display Layout

**Chosen:** Split view with main chat area (left/center) and member sidebar (right)

**Rationale:** Industry-standard chat layout. Message area takes priority; members visible but non-intrusive. Mobile: members collapse to a toggle/overlay.

### Decision 2: WebSocket Message Format

**Chosen:** STOMP over SockJS with JSON payloads

**Rationale:** SockJS provides browser compatibility fallbacks. JSON is consistent with existing API style. STOMP provides built-in framing and subscription management.

### Decision 3: Message Storage

**Chosen:** Store all messages in PostgreSQL via Spring Data JPA

**Rationale:** Messages must persist across browser sessions and be loaded on chat entry. JPA repositories are already set up for other entities.

### Decision 4: Membership Tracking

**Chosen:** Track membership in `chat_members` table; no explicit "join" action needed

**Rationale:** User automatically becomes a member when chat is created. When they navigate to a chat room, they are already a member. Leave action removes them from the chat.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| WebSocket reconnection on network dropout | WebSocketService implements exponential backoff reconnection |
| Messages load slowly on large chats | Infinite scroll loads older messages on demand |
| Member list stale if user closes browser without leaving | Server-side cleanup via heartbeat/timeout; trust client disconnect |

## Open Questions

**Resolved:**

### Message Loading: Infinite Scroll
**Decision:** Messages load via infinite scroll - older messages are fetched when user scrolls to the top of the message list.

**Rationale:** Better UX than pagination buttons. Common pattern in modern chat apps. Initial load is last 50 messages; scrolling up fetches older messages in batches of 50.

### Message Send Failures: Retry with Configurable Attempts
**Decision:** Failed message sends retry automatically. Maximum retry count is configurable via environment settings.

**Rationale:** Network transient failures should be handled gracefully without requiring user manual retry. Configurable via `messageMaxRetries` in environment.ts (default: 3).
