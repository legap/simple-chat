## ADDED Requirements

### Requirement: Environment-based API URL configuration
The system SHALL provide environment-specific API URL configuration through Angular environment files, enabling seamless switching between local development and production environments without code changes.

#### Scenario: Local development uses proxy to backend
- **WHEN** Angular dev server starts with default configuration
- **THEN** API requests to `/api/*` SHALL be proxied to `http://localhost:8080`
- **AND** WebSocket connections to `/ws/*` SHALL be proxied to `http://localhost:8080`

#### Scenario: Production uses configurable base URL
- **WHEN** Application is built for production with `ng build --configuration=production`
- **THEN** API base URL SHALL be read from `environment.prod.ts`
- **AND** Default production URL SHALL be the same origin (relative URL)

#### Scenario: API URL is accessible to services
- **WHEN** An Angular service needs to construct an API endpoint
- **THEN** The service SHALL access the API URL via `environment.apiUrl`
- **AND** The service SHALL append the endpoint path (e.g., `/api/chats`)

#### Scenario: Proxy config routes correct paths
- **WHEN** A request is made to `http://localhost:4200/api/chats`
- **THEN** The proxy SHALL forward the request to `http://localhost:8080/api/chats`
- **AND** The response SHALL be returned to the Angular application without path modification

### Requirement: WebSocket URL configuration
The system SHALL provide WebSocket URL configuration through the environment files, separate from the HTTP API URL.

#### Scenario: WebSocket URL configurable independently
- **WHEN** Angular service establishes STOMP connection
- **THEN** The WebSocket URL SHALL be read from `environment.wsUrl`
- **AND** Default WebSocket URL in development SHALL be `ws://localhost:8080/ws`
- **AND** Default WebSocket URL in production SHALL use dynamic hostname (`ws://${window.location.hostname}/ws`) to support containerized deployments

### Requirement: WebSocket reconnection handling
The system SHALL implement automatic reconnection with exponential backoff for STOMP connections.

#### Scenario: Connection loss triggers reconnection
- **WHEN** STOMP connection is lost unexpectedly
- **THEN** The service SHALL attempt to reconnect with exponential backoff
- **AND** Maximum reconnection attempts SHALL be configurable
- **AND** UI SHALL indicate connection status to user during reconnection attempts

### Requirement: Environment files are properly structured
The system SHALL use Angular's standard environment file structure with proper TypeScript typing.

#### Scenario: Environment interface is consistent
- **WHEN** New environment-specific properties are added
- **THEN** All environment files SHALL implement a common `Environment` interface
- **AND** The interface SHALL define all configurable properties with their types

#### Scenario: Development environment file exists
- **WHEN** Angular application is bootstrapped in development mode
- **THEN** `src/environments/environment.ts` SHALL exist
- **AND** It SHALL export `environment` object with `production: false`
- **AND** It SHALL contain `apiUrl` and `wsUrl` properties

#### Scenario: Production environment file exists
- **WHEN** Angular application is built for production
- **THEN** `src/environments/environment.prod.ts` SHALL exist
- **AND** It SHALL export `environment` object with `production: true`
- **AND** It SHALL contain `apiUrl` and `wsUrl` properties with production values
