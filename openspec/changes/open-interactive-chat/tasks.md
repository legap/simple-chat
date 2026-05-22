## 1. Backend: Message Model and Repository

- [ ] 1.1 Verify Message entity exists with correct fields (id, chatId, userId, content, sentAt)
- [ ] 1.2 Create MessageRepository with method to findByChatIdOrderBySentAtAsc
- [ ] 1.3 Create MessageDto for API responses (id, chatId, senderUsername, content, sentAt)

## 2. Backend: REST Endpoints for Messages

- [ ] 2.1 Add GET /api/chats/{chatId}/messages endpoint returning last 50 messages
- [ ] 2.2 Add POST /api/chats/{chatId}/messages for sending a message (optional, for history reload)

## 3. Backend: Chat Membership

- [ ] 3.1 Add GET /api/chats/{chatId}/members endpoint returning list of usernames
- [ ] 3.2 Add DELETE /api/chats/{chatId}/members/{userId} for leaving a chat
- [ ] 3.3 Modify POST /api/chats to auto-add creator as first member
- [ ] 3.4 Add auto-join logic when user accesses chat they're not yet a member of

## 4. Backend: WebSocket Message Handler

- [ ] 4.1 Update ChatWebSocketHandler to handle message send events
- [ ] 4.2 Persist message to database on receive
- [ ] 4.3 Broadcast message to /topic/chat.{chatId} subscribers
- [ ] 4.4 Broadcast member list updates on join/leave

## 5. Frontend: Chat Room Component Layout

- [ ] 5.1 Update chat-room.component.ts to use split view layout (chat area + member sidebar)
- [ ] 5.2 Add Angular Material components: mat-list for member sidebar, scroll container for messages
- [ ] 5.3 Add "Leave Chat" button in toolbar
- [ ] 5.4 Add responsive styling for mobile (hide member list behind toggle)

## 6. Frontend: Message Display and Input

- [ ] 6.1 Create message list display with sender name, content, timestamp
- [ ] 6.2 Create message input field with Send button
- [ ] 6.3 Handle Enter key to send message
- [ ] 6.4 Validate non-empty message before sending

## 7. Frontend: WebSocket Integration

- [ ] 7.1 Update ChatRoomComponent to use WebSocketService for connection
- [ ] 7.2 Subscribe to /topic/chat.{chatId} for incoming messages
- [ ] 7.3 Send messages to /app/chat.{chatId}
- [ ] 7.4 Display connection status indicator
- [ ] 7.5 Implement onDestroy to disconnect on component destruction

## 8. Frontend: Member Sidebar

- [ ] 8.1 Fetch member list on chat entry via GET /api/chats/{chatId}/members
- [ ] 8.2 Display member list in sidebar
- [ ] 8.3 Subscribe to member list updates via WebSocket

## 9. Integration and Verification

- [ ] 9.1 Run backend and frontend together
- [ ] 9.2 Verify messages send and receive in real-time
- [ ] 9.3 Verify member list updates when users join/leave
- [ ] 9.4 Verify leave chat returns to chat list
