# Frontend Architecture

## Stack

- Angular 22+ with standalone components
- Angular Material UI
- WebSocket communication via STOMP.js + sockjs-client
- Pages: Login (`/login`), Chat List (`/chats`), Chat Room (`/chats/{id}`)

## Local Development

```bash
cd frontend
npm install
ng serve
```

The Angular dev server proxies `/api/*` and `/ws/*` requests to the backend via `proxy.conf.json`.

### Environment Configuration

Environment files in `src/environments/`:
- `environment.ts` - development settings (localhost:8080)
- `environment.prod.ts` - production settings (dynamic hostname)

## Production

In production, the frontend should be served by a proper web server (nginx, Caddy) that proxies `/api/*` and `/ws/*` to the Spring Boot backend.
