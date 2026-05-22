# Simple Chat Application Plan

## Context

Building a simple group chat application with Angular frontend and Java/SpringBoot backend. Users pick a username to join, can create/join group chats, and exchange messages in real-time via WebSockets. Messages persist in PostgreSQL.

## Tech Stack

**Frontend**
- Angular 22+ with standalone components
- Angular Material (UI components)
- STOMP.js + sockjs-client for WebSocket communication
- TypeScript 5.5+

**Backend**
- Java 25 LTS with SpringBoot 4.0+
- Spring Framework 7.x 
- Spring WebSocket with STOMP
- Spring Data JPA + PostgreSQL
- Simple username-based "auth" (no passwords)

---

## Backend Design

### Database Schema

**Table: `users`**
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

**Table: `chats`**
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| name | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| created_by | BIGINT | FK → users.id |

**Table: `chat_members`**
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| chat_id | BIGINT | FK → chats.id |
| user_id | BIGINT | FK → users.id |
| joined_at | TIMESTAMP | DEFAULT NOW() |

**Table: `messages`**
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| chat_id | BIGINT | FK → chats.id |
| user_id | BIGINT | FK → users.id |
| content | TEXT | NOT NULL |
| sent_at | TIMESTAMP | DEFAULT NOW() |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users` | Create user with username |
| GET | `/api/users/{username}` | Get user by username |
| GET | `/api/chats` | List all chats (with member count) |
| POST | `/api/chats` | Create new chat |
| GET | `/api/chats/{id}` | Get chat details |
| POST | `/api/chats/{id}/join` | Join a chat |
| GET | `/api/chats/{id}/messages` | Get message history (paginated) |

### WebSocket Endpoints

| Endpoint | Type | Description |
|----------|------|-------------|
| `/ws` | STOMP | WebSocket handshake endpoint |
| `/topic/chat.{chatId}` | Subscribe | Receive messages for a chat |
| `/app/chat.{chatId}` | Send | Send a message to a chat |

### Message Flow

1. Client connects to `/ws` with username query param or header
2. Client subscribes to `/topic/chat.{chatId}` for real-time messages
3. Client sends to `/app/chat.{chatId}` to post a message
4. Server broadcasts to all subscribers of `/topic/chat.{chatId}`

---

## Frontend Design

### Pages

1. **Login Page** (`/login`)
   - Single input: username
   - "Enter" button → creates user if not exists, navigates to chat list

2. **Chat List Page** (`/chats`) - default route after login
   - List of all chats showing: name, member count, last message preview
   - "Create Chat" button → dialog with chat name input
   - Click chat → navigate to `/chats/{id}`

3. **Chat Room Page** (`/chats/{id}`)
   - Header: chat name
   - Message list (scrollable, newest at bottom)
   - Load more button / infinite scroll for history
   - Message input at bottom
   - "Leave" or back button

### Key Components

- `LoginComponent` - standalone
- `ChatListComponent` - standalone
- `ChatRoomComponent` - standalone
- `CreateChatDialogComponent` - Angular Material dialog
- `MessageComponent` - reusable message bubble
- `ChatListItemComponent` - reusable list item

### Services

- `AuthService` - manages current user
- `ChatService` - REST calls for chats/messages
- `WebSocketService` - STOMP connection management

---

## Project Structure

```
backend/
├── src/main/java/com/simplechat/
│   ├── SimpleChatApplication.java
│   ├── config/
│   │   └── WebSocketConfig.java
│   ├── controller/
│   │   ├── UserController.java
│   │   ├── ChatController.java
│   │   └── MessageController.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Chat.java
│   │   ├── ChatMember.java
│   │   └── Message.java
│   ├── repository/
│   │   └── (JPA repositories)
│   └── service/
│       └── (business logic)
├── src/main/resources/
│   └── application.properties
└── pom.xml

frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── chat.service.ts
│   │   │   └── websocket.service.ts
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── chat-list/
│   │   │   ├── chat-room/
│   │   │   ├── create-chat-dialog/
│   │   │   ├── message/
│   │   │   └── chat-list-item/
│   │   └── models/
│   │       ├── user.ts
│   │       ├── chat.ts
│   │       └── message.ts
│   └── main.ts
├── angular.json
└── package.json
```

---

## Verification

### Backend
1. Run SpringBoot app (`mvn spring-boot:run`)
2. Test REST endpoints with curl:
   ```bash
   curl -X POST http://localhost:8080/api/users -d "username=alice"
   curl http://localhost:8080/api/chats
   curl http://localhost:8080/api/chats/1/messages
   ```
3. Connect to WebSocket using Postman or websocat:
   ```
   websocat ws://localhost:8080/ws
   ```

### Frontend
1. Run Angular dev server (`ng serve`)
2. Navigate to `http://localhost:4200`
3. Login with a username
4. Create a chat, send messages, verify real-time delivery across browser tabs
5. Verify message history loads on chat entry

### End-to-End
1. Open two browsers/tabs with different usernames
2. Create/join same chat in both
3. Send message in one → appears instantly in other
4. Refresh page → messages persist
