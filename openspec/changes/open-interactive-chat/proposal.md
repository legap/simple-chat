## Why

The chat room page currently shows only placeholder content. Users cannot view messages, see who else is in the chat, or send messages. Without real-time message propagation, the chat is not functional.

## What Changes

- Chat room page displays messages and supports sending new messages
- Users see a list of other members in the chat on the right side
- Messages propagate to all connected users in real-time via WebSocket
- Users can leave a chat and return to the chat list overview
- When a user creates a new chat or clicks an existing one, they automatically join that chat

## Capabilities

### New Capabilities
- `chat-room-page`: Full chat room experience with messages, member list, message sending, and real-time WebSocket updates
- `chat-membership`: Automatic join on chat entry, leave functionality, member presence tracking
- `websocket-messaging`: Real-time message broadcasting via STOMP WebSocket

### Modified Capabilities
- `chat-list-page`: When user clicks a chat, they navigate to the chat room (already defined behavior, now needs implementation)

## Impact

- Frontend: New chat-room component with message display, member sidebar, message input; WebSocketService integration
- Backend: Message persistence, chat membership tracking, WebSocket broadcast logic
- Database: May need new queries for messages by chat and member lists
