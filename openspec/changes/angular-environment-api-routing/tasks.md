## 1. Environment Configuration Setup

- [ ] 1.1 Create `src/environments/` directory structure
- [ ] 1.2 Create `src/environments/environment.ts` with development settings (apiUrl: 'http://localhost:8080', wsUrl: 'ws://localhost:8080/ws', production: false)
- [ ] 1.3 Create `src/environments/environment.prod.ts` with production settings (apiUrl: '', wsUrl: 'ws://window.location.hostname/ws', production: true)
- [ ] 1.4 Add Environment interface to `src/environments/environment.model.ts` for type safety

## 2. Proxy Configuration

- [ ] 2.1 Create `proxy.conf.json` in frontend root with `/api/*` and `/ws/*` routes to `http://localhost:8080`
- [ ] 2.2 Update `angular.json` to reference proxy config during `ng serve`
- [ ] 2.3 Verify proxy works by running `ng serve` and checking API calls reach backend

## 3. API Service Updates

- [ ] 3.1 Identify existing API service files that make HTTP calls
- [ ] 3.2 Update `ChatService` to use `environment.apiUrl` for constructing API endpoints
- [ ] 3.3 Create `WebSocketService` with reconnection logic using exponential backoff
- [ ] 3.4 Configure STOMP client to use `environment.wsUrl` for connection URL

## 4. Angular Configuration

- [ ] 4.1 Verify `angular.json` has file replacement configured for environment.prod.ts
- [ ] 4.2 Confirm `environment.ts` is not included in production builds (should be in .gitignore)

## 5. Verification

- [ ] 5.1 Run `npm start` and verify `/api/chats` returns data from backend
- [ ] 5.2 Run `npm run build -- --configuration=production` and verify bundle uses environment.prod.ts values
