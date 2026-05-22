## Why

The Angular frontend currently has no environment-based configuration for API URLs. API calls are hardcoded or misrouted to port 4200 (Angular dev server) instead of port 8080 (Spring Boot backend). This prevents proper frontend-backend communication and violates the twelve-factor app methodology for configuration management.

## What Changes

- Add Angular environment files with configurable API URL settings
- Create a proxy configuration to route `/api/*` requests to the backend during local development
- Update existing services to use the environment-based API URL
- Provide production-ready configuration that can be overridden via environment variables

## Capabilities

### New Capabilities

- **api-environment-config**: Environment-based API URL configuration that supports:
  - Local development: Uses proxy config to route `/api/*` to `http://localhost:8080`
  - Production: Uses configurable base URL (defaults to same origin)
  - Seamless switching between environments without code changes

### Modified Capabilities

- `chat-list-page`: The chat list currently fetches from a hardcoded URL; will now use the environment-configured API URL

## Impact

- **Frontend**: New `environment.ts` files, proxy config, updated API service
- **Backend**: No changes required
- **DevOps**: Environment variables can override API URL in production deployments
