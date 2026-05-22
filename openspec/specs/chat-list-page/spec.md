# Chat List Page Spec

## Summary

The root context (`/`) displays all available chat rooms and allows users to create new chats.

## UX Behavior

### Layout
```
┌────────────────────────────────────────────┐
│  SimpleChat                    [username]  │  <- Header with username
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │  + Create New Chat                   │  │  <- Primary action button
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Chat Room Alpha          3 members  │  │
│  │  Last message preview...    5m ago    │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  General Discussion        12 members │  │
│  │  Hey everyone!              1h ago    │  │
│  └──────────────────────────────────────┘  │
│                                            │
│              ... more chats ...            │
└────────────────────────────────────────────┘
```

### Interactions

| Action | Behavior |
|--------|----------|
| Click "Create New Chat" | Opens dialog with chat name input |
| Submit new chat form | Creates chat, navigates to new chat room |
| Click chat item | Navigates to `/chats/{id}` |
| Submit empty name | Shows validation error, prevents submission |

### Create Chat Dialog
```
┌──────────────────────────────────────┐
│  Create New Chat                  X  │
├──────────────────────────────────────┤
│  Chat Name                          │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│       [Cancel]  [Create]            │
└──────────────────────────────────────┘
```

## Data Model

### Chat List Item
```typescript
interface ChatListItem {
  id: number;
  name: string;
  memberCount: number;
  lastMessage?: {
    content: string;  // truncated to ~50 chars
    sentAt: Date;
  };
}
```

### API Contract

**GET /api/chats** → Returns list of chats with member count and last message
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

**POST /api/chats** → Creates new chat
```json
// Request
{ "name": "New Chat Name" }

// Response
{ "id": 5, "name": "New Chat Name", ... }
```

## Technical Notes

- Root path `/` redirects to `/chats`
- Chat list page lives at `/chats`
- Chat list component: `ChatListComponent` (standalone)
- Create chat dialog: `CreateChatDialogComponent` (Angular Material dialog)
- Use `ChatService` for REST calls

## Open Questions
- [ ] How to handle unauthenticated access to root path?
