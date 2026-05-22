# Backend Architecture

## Stack

- Java 25 / SpringBoot 4.0
- Spring WebSocket with STOMP messaging
- Spring Data JPA + PostgreSQL for persistence
- Simple username-based "auth" (no passwords)

## Real-time Messaging Flow

1. Client connects to `/ws` with username
2. Client subscribes to `/topic/chat.{chatId}` for messages
3. Client sends to `/app/chat.{chatId}` to post
4. Server broadcasts to all subscribers

## Local Development

```bash
cd backend
mvn spring-boot:run
```

Requires PostgreSQL running on port 5432.

### CORS Configuration

For local development, the backend allows all origins (`*`) on `/api/**` endpoints. This is configured in `CorsConfig.java` for HTTP and via `setAllowedOrigins("*")` in `WebSocketConfig.java` for WebSocket.

**Important:** When using the Angular dev server proxy, CORS is bypassed. CORS is only relevant when accessing the backend directly (e.g., `http://localhost:8080/api/chats`).

## Production

The backend should be deployed behind a web server (nginx, Caddy) that handles SSL termination and proxies `/api/*` and `/ws/*` requests. CORS can be restricted in production if needed.

## Database Schema

- **users**: id, username (unique), created_at
- **chats**: id, name, created_at, created_by (FK)
- **chat_members**: id, chat_id, user_id, joined_at
- **messages**: id, chat_id, user_id, content, sent_at

## Coding Standards

### Import Management

Unused imports must not be committed. Before committing, run:

```bash
mvn compile
```

or use your IDE to highlight unused imports. The build will fail if unused imports are present.

**Strategy:** Add imports as needed but always verify they are actually used before committing. When removing functionality, always remove corresponding imports. IDE shortcuts (e.g., `Ctrl+Alt+O` in IntelliJ / `Cmd+Option+O` in VS Code) can organize and remove unused imports automatically.
