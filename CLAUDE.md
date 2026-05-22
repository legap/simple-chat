# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple Chat is a group chat application with Angular frontend and Java/SpringBoot backend. Users pick a username to join, create/join group chats, and exchange messages in real-time via WebSockets.

## Working Mode

Work in small increments. After each change, summarize what was done and let the user review before continuing.

## Architecture

### Frontend (Angular 22+)
- Standalone components with Angular Material UI
- WebSocket communication via STOMP.js + sockjs-client
- Pages: Login (`/login`), Chat List (`/chats`), Chat Room (`/chats/{id}`)

### Backend (Java 25 / SpringBoot 4.0)
- Spring WebSocket with STOMP messaging
- Spring Data JPA + PostgreSQL for persistence
- Simple username-based "auth" (no passwords)

### Real-time Messaging Flow
1. Client connects to `/ws` with username
2. Client subscribes to `/topic/chat.{chatId}` for messages
3. Client sends to `/app/chat.{chatId}` to post
4. Server broadcasts to all subscribers

## Commands

### Backend
```bash
cd backend
mvn spring-boot:run          # Run SpringBoot app
mvn test                     # Run tests
```

### Frontend
```bash
cd frontend
npm install                  # Install dependencies
ng serve                     # Run dev server (http://localhost:4200)
ng test                      # Run tests
```

### OpenSpec Workflow
```bash
/claude opsx:propose "change description"   # Create new change proposal
/claude opsx:apply                         # Implement tasks from current change
/claude opsx:archive                        # Archive completed change
```

## Database Schema

- **users**: id, username (unique), created_at
- **chats**: id, name, created_at, created_by (FK)
- **chat_members**: id, chat_id, user_id, joined_at
- **messages**: id, chat_id, user_id, content, sent_at

## Key Files

- `docs/plans/build-tiny-chat-application.md` - Full project specification
- `openspec/config.yaml` - OpenSpec configuration
- `openspec/changes/` - Change proposals and implementations
