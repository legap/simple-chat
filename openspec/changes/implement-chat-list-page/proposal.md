# Proposal: Implement Chat List Page

## Summary
Implement the chat-list-page spec which covers the root route (`/chats`) displaying all available chat rooms with ability to create new chats.

## What
- Scaffold frontend Angular project with Angular Material
- Implement ChatListComponent at `/chats` route
- Implement CreateChatDialogComponent (Material dialog)
- Create ChatService for REST API calls
- Scaffold backend SpringBoot project
- Implement ChatController with GET /api/chats and POST /api/chats
- Create JPA entities: Chat, ChatMember, User
- Configure WebSocket and REST endpoints

## Why
The chat-list-page is the main entry point after login, showing all available chatrooms and allowing users to create new ones. This establishes the core structure for the application.

## Tasks
See tasks.md