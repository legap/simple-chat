## Context

The Angular frontend communicates with a Spring Boot backend via REST API and WebSocket. Currently, Angular makes API calls to relative URLs or misconfigured ports, causing the dev server (port 4200) to return 404s instead of proxying to the backend (port 8080).

Angular provides built-in support for environment-specific configuration via `environment.ts` files and a proxy configuration for local development.

## Goals / Non-Goals

**Goals:**
- Route `/api/*` requests from Angular dev server (port 4200) to Spring Boot backend (port 8080)
- Support configurable API base URL per environment (dev, production)
- Allow production API URL override via environment variables
- Use Angular's standard patterns (environment files + proxy config)

**Non-Goals:**
- Implementing a service discovery mechanism
- Adding authentication token management
- Modifying the backend API endpoints

## Decisions

### Decision 1: Angular Environment Files vs. Runtime Configuration

**Chosen:** Angular environment files (`environment.ts`, `environment.prod.ts`)

**Rationale:** Angular's standard approach with build-time substitution. Type-safe, tree-shakeable, and the idiomatic way to manage environment-specific values in Angular applications.

**Alternative:** Runtime configuration via `APP_INITIALIZER` and HTTP fetch
- Rejected: More complex, adds startup latency, requires additional error handling

### Decision 2: Proxy Config File vs. Backend Proxy

**Chosen:** Angular CLI proxy configuration (`proxy.conf.json`)

**Rationale:**
- Zero backend changes required
- Angular CLI handles the proxy automatically during `ng serve`
- Supports path rewriting, multiple targets, and fallback options
- Standard Angular practice for local dev proxying

**Alternative:** Backend CORS configuration
- Rejected: CORS is not a substitute for a proper proxy in production; adds complexity to backend

### Decision 3: API Base URL Structure

**Chosen:** `environment.apiUrl` as the base URL with services constructing full paths

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// chat.service.ts
private getAllChatsUrl = () => `${environment.apiUrl}/api/chats`;
```

**Rationale:**
- Single source of truth for the API base URL
- Services remain in control of their own endpoint paths
- Easy to override in production via environment variable injection at build time

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Dev proxy only works during `ng serve` | Document that production requires proper proxy (nginx, Caddy, etc.) |
| Environment files are baked at build time | Use CI/CD environment variable injection for prod builds |
| WebSocket URL also needs configuration | Extend environment config to include `wsUrl` for STOMP connection |

## Open Questions

**Resolved via STOMP Best Practices:**

### WebSocket URL Configuration
**Decision:** The `wsUrl` SHALL be configured in environment files, independent of `apiUrl`.

**Rationale:** HTTP API and WebSocket connections may have different URL patterns or hostname requirements in production. STOMP over WebSocket typically uses the `/ws` path prefix, which can differ from the API base path.

**Best Practices for STOMP.js:**
1. **Reconnection**: STOMP.js does NOT auto-reconnect. Must implement reconnection logic with exponential backoff
2. **Heartbeats**: Enable STOMP heartbeats (configurable in both client and server) to detect dead connections
3. **SockJS fallback**: Consider SockJS for environments with restrictive proxies, but it adds ~30KB overhead
4. **Connection lifecycle**: Always disconnect on Angular route changes to prevent stale connections

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '',  // Same-origin, relative URL
  wsUrl: `ws://${window.location.hostname}/ws`  // Dynamic host for containerized deployments
};
```

### Default Production URL
**Decision:** Production SHALL default to same-origin for API (relative URLs) and dynamic hostname for WebSocket.

**Rationale:** Containerized/factor-app deployments use environment-injected hostnames, not hardcoded values. Using `window.location.hostname` in the browser allows the WebSocket URL to adapt to the deployment environment without rebuilds.
