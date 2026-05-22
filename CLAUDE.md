# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple Chat is a group chat application with Angular frontend and Java/SpringBoot backend. Users pick a username to join, create/join group chats, and exchange messages in real-time via WebSockets.

## Working Mode

Work in small increments. After each change, summarize what was done and let the user review before continuing.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full architecture documentation.

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

## Key Files

- `docs/plans/build-tiny-chat-application.md` - Full project specification
- `frontend/ARCHITECTURE.md` - Frontend architecture
- `backend/ARCHITECTURE.md` - Backend architecture
- `openspec/config.yaml` - OpenSpec configuration
- `openspec/changes/` - Change proposals and implementations
