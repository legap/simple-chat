## ADDED Requirements

### Requirement: Chat room page displays messages
The system SHALL display messages for the current chat in chronological order, with the newest messages at the bottom.

#### Scenario: User enters chat room with existing messages
- **WHEN** user navigates to `/chats/{id}`
- **THEN** system SHALL load the last 50 messages for that chat
- **AND** display them in the message area with sender name, message content, and timestamp

#### Scenario: User enters chat room with no messages
- **WHEN** user navigates to `/chats/{id}` for a chat with no messages
- **THEN** system SHALL display an empty state message "No messages yet. Be the first to say something!"

### Requirement: Chat room page shows member sidebar
The system SHALL display a list of all members currently in the chat on the right side of the screen.

#### Scenario: Display member list
- **WHEN** user is viewing the chat room
- **THEN** system SHALL display all chat member usernames in a sidebar
- **AND** update the list when members join or leave

#### Scenario: Member list on mobile
- **WHEN** user is on a device with screen width below 768px
- **THEN** member list SHALL be hidden by default
- **AND** accessible via a toggle button

### Requirement: Chat room page has message input
The system SHALL provide a text input field for composing and sending messages.

#### Scenario: Send a message
- **WHEN** user types a message and presses Enter or clicks Send
- **THEN** system SHALL send the message via WebSocket
- **AND** clear the input field
- **AND** display the message in the chat area

#### Scenario: Empty message not sent
- **WHEN** user attempts to send a message with empty or whitespace-only content
- **THEN** system SHALL NOT send the message
- **AND** SHALL show a validation error

### Requirement: Leave chat button returns to chat list
The system SHALL provide a way to leave the current chat and return to the chat list overview.

#### Scenario: Leave chat
- **WHEN** user clicks "Leave Chat" button
- **THEN** system SHALL navigate to `/chats`
- **AND** remove the user from the chat member list
