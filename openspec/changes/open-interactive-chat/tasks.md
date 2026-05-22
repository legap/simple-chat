## 1. Backend: Message Model and Repository

- [x] 1.1 Verify Message entity exists with correct fields (id, chatId, userId, content, sentAt)
- [x] 1.2 Create MessageRepository with method to findByChatIdOrderBySentAtAsc
- [x] 1.3 Create MessageDto for API responses (id, chatId, senderUsername, content, sentAt)

## 2. Backend: REST Endpoints for Messages

- [x] 2.1 Add GET /api/chats/{chatId}/messages endpoint returning last 50 messages
- [x] 2.2 Add POST /api/chats/{chatId}/messages for sending a message (optional, for history reload) - using WebSocket instead

## 3. Backend: Chat Membership

- [x] 3.1 Add GET /api/chats/{chatId}/members endpoint returning list of usernames
- [x] 3.2 Add DELETE /api/chats/{chatId}/members/{userId} for leaving a chat
- [x] 3.3 Modify POST /api/chats to auto-add creator as first member
- [x] 3.4 Add auto-join logic when user accesses chat they're not yet a member of

## 4. Backend: WebSocket Message Handler

- [x] 4.1 Update ChatWebSocketHandler to handle message send events
- [x] 4.2 Persist message to database on receive
- [x] 4.3 Broadcast message to /topic/chat.{chatId} subscribers
- [x] 4.4 Broadcast member list updates on join/leave

## 5. Frontend: Chat Room Component Layout

- [x] 5.1 Update chat-room.component.ts to use split view layout (chat area + member sidebar)
- [x] 5.2 Add Angular Material components: mat-list for member sidebar, scroll container for messages
- [x] 5.3 Add "Leave Chat" button in toolbar
- [x] 5.4 Add responsive styling for mobile (hide member list behind toggle)

## 6. Frontend: Message Display and Input

- [x] 6.1 Create message list display with sender name, content, timestamp
- [x] 6.2 Create message input field with Send button
- [x] 6.3 Handle Enter key to send message
- [x] 6.4 Validate non-empty message before sending

## 7. Frontend: WebSocket Integration

- [x] 7.1 Update ChatRoomComponent to use WebSocketService for connection
- [x] 7.2 Subscribe to /topic/chat.{chatId} for incoming messages
- [x] 7.3 Send messages to /app/chat.{chatId}
- [x] 7.4 Display connection status indicator
- [x] 7.5 Implement onDestroy to disconnect on component destruction

## 8. Frontend: Member Sidebar

- [x] 8.1 Fetch member list on chat entry via GET /api/chats/{chatId}/members
- [x] 8.2 Display member list in sidebar
- [x] 8.3 Subscribe to member list updates via WebSocket

## 9. Integration and Verification

- [ ] 9.1 Run backend and frontend together
- [ ] 9.2 Verify messages send and receive in real-time
- [ ] 9.3 Verify member list updates when users join/leave
- [ ] 9.4 Verify leave chat returns to chat list
