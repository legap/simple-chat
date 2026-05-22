## ADDED Requirements

### Requirement: User auto-joins chat on navigation
The system SHALL automatically add the user to the chat's member list when they navigate to a chat room.

#### Scenario: User navigates to chat room
- **WHEN** user navigates to `/chats/{id}`
- **THEN** system SHALL verify user is a member of that chat
- **AND** if not a member, add them to `chat_members` table

#### Scenario: User navigates to chat they created
- **WHEN** user created a chat and then navigates to its room
- **THEN** system SHALL recognize them as a member (already added at creation time)

### Requirement: User can leave a chat
The system SHALL allow a user to leave a chat, removing them from the member list.

#### Scenario: Leave chat action
- **WHEN** user clicks "Leave Chat"
- **THEN** system SHALL remove the user's entry from `chat_members` for that chat
- **AND** broadcast updated member list to remaining users

#### Scenario: User re-enters a chat they left
- **WHEN** user who previously left a chat navigates back to it
- **THEN** system SHALL re-add them to `chat_members`

### Requirement: Member list is broadcast on changes
The system SHALL broadcast the updated member list to all users in the chat when a user joins or leaves.

#### Scenario: Broadcast member join
- **WHEN** a new user joins the chat
- **THEN** system SHALL broadcast the updated member list to all subscribers

#### Scenario: Broadcast member leave
- **WHEN** a user leaves the chat
- **THEN** system SHALL broadcast the updated member list to all remaining subscribers
