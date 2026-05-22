# Design: Implement Chat List Page

## Frontend Architecture

### Component Structure
```
ChatListComponent (standalone)
├── Header (username display)
├── CreateChatButton
├── ChatListItemComponent (repeated)
│   ├── Chat name
│   ├── Member count
│   └── Last message preview + timestamp
└── CreateChatDialogComponent (Material Dialog)
    ├── Title: "Create New Chat"
    ├── Text input: chat name
    ├── Cancel button
    └── Create button
```

### Routing
- `/` → redirects to `/chats`
- `/chats` → ChatListComponent
- `/chats/:id` → ChatRoomComponent (future)

### Services
**ChatService**
- `getChats(): Observable<ChatListItem[]>` → GET /api/chats
- `createChat(name: string): Observable<Chat>` → POST /api/chats

### Data Models
```typescript
interface ChatListItem {
  id: number;
  name: string;
  memberCount: number;
  lastMessage?: {
    content: string;
    sentAt: Date;
  };
}

interface Chat {
  id: number;
  name: string;
  createdAt: Date;
}
```

## Backend Architecture

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/chats | List all chats with member count and last message |
| POST | /api/chats | Create new chat |

### Response Shape (GET /api/chats)
```json
[
  {
    "id": 1,
    "name": "Chat Room Alpha",
    "memberCount": 3,
    "lastMessage": {
      "content": "Last message preview...",
      "sentAt": "2026-05-22T10:30:00Z"
    }
  }
]
```

### JPA Entities
- **Chat**: id, name, createdAt, createdBy (ManyToOne User)
- **ChatMember**: id, chatId, userId, joinedAt
- **User**: id, username, createdAt

## Implementation Order
1. Scaffold frontend project structure
2. Create data models
3. Create ChatService
4. Implement ChatListComponent
5. Implement CreateChatDialogComponent
6. Scaffold backend project structure
7. Create JPA entities
8. Implement ChatController