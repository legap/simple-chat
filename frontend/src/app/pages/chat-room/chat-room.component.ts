import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { WebSocketService, ConnectionStatus } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="leaveChat()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Chat Room</span>
      <span class="spacer"></span>
      <span class="connection-status" [class.connected]="connectionStatus.connected" [class.reconnecting]="connectionStatus.reconnecting">
        {{ connectionStatus.connected ? 'Connected' : connectionStatus.reconnecting ? 'Reconnecting...' : 'Disconnected' }}
      </span>
      <button mat-icon-button (click)="toggleMobileMenu()" class="mobile-menu-btn">
        <mat-icon>people</mat-icon>
      </button>
    </mat-toolbar>

    <div class="chat-container">
      <div class="chat-main">
        <div class="messages-container" #messagesContainer>
          <div *ngIf="messages.length === 0" class="empty-state">
            <p>No messages yet. Be the first to say something!</p>
          </div>
          <div *ngFor="let message of messages" class="message" [class.own-message]="message.userId === currentUserId">
            <div class="message-header">
              <span class="sender">{{ message.username }}</span>
              <span class="timestamp">{{ message.sentAt | date:'short' }}</span>
            </div>
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>

        <div class="input-container">
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Type a message</mat-label>
            <input matInput [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" [disabled]="!connectionStatus.connected">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="sendMessage()" [disabled]="!newMessage.trim() || !connectionStatus.connected">
            Send
          </button>
        </div>
        <div *ngIf="validationError" class="validation-error">{{ validationError }}</div>
      </div>

      <div class="members-sidebar" [class.mobile-hidden]="mobileMenuHidden">
        <h3>Members ({{ members.length }})</h3>
        <mat-list>
          <mat-list-item *ngFor="let member of members">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>{{ member }}</span>
          </mat-list-item>
        </mat-list>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      height: calc(100vh - 64px);
    }
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #999;
    }
    .message {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      max-width: 70%;
    }
    .own-message {
      background: #e3f2fd;
      margin-left: auto;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 12px;
    }
    .sender {
      font-weight: bold;
      color: #1976d2;
    }
    .own-message .sender {
      color: #0d47a1;
    }
    .timestamp {
      color: #999;
    }
    .message-content {
      word-wrap: break-word;
    }
    .input-container {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
      align-items: center;
    }
    .input-container mat-form-field {
      flex: 1;
    }
    .validation-error {
      color: red;
      padding: 0 16px;
      font-size: 12px;
    }
    .members-sidebar {
      width: 250px;
      background: #fafafa;
      border-left: 1px solid #e0e0e0;
      padding: 16px;
      overflow-y: auto;
    }
    .members-sidebar h3 {
      margin-top: 0;
    }
    .connection-status {
      font-size: 12px;
      margin-right: 8px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #f44336;
      color: white;
    }
    .connection-status.connected {
      background: #4caf50;
    }
    .connection-status.reconnecting {
      background: #ff9800;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .mobile-menu-btn {
      display: none;
    }
    @media (max-width: 768px) {
      .members-sidebar {
        position: fixed;
        right: 0;
        top: 64px;
        bottom: 0;
        z-index: 100;
        background: white;
      }
      .members-sidebar.mobile-hidden {
        display: none;
      }
      .mobile-menu-btn {
        display: inline-flex;
      }
    }
  `]
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private wsService = inject(WebSocketService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  chatId!: number;
  currentUserId?: number;
  messages: Message[] = [];
  members: string[] = [];
  newMessage = '';
  validationError = '';
  mobileMenuHidden = true;
  connectionStatus: ConnectionStatus = { connected: false, reconnecting: false, attempts: 0 };

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.chatId = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.userService.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserId = user.id;

    this.loadMessages();
    this.loadMembers();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.wsService.disconnect();
  }

  loadMessages(): void {
    this.chatService.getMessages(this.chatId, this.currentUserId).subscribe({
      next: (messages) => this.messages = messages,
      error: (err) => console.error('Failed to load messages', err)
    });
  }

  loadMembers(): void {
    this.chatService.getMembers(this.chatId, this.currentUserId).subscribe({
      next: (members) => this.members = members,
      error: (err) => console.error('Failed to load members', err)
    });
  }

  connectWebSocket(): void {
    this.wsService.connect(
      () => {
        this.subscribeToChat();
      },
      (error) => {
        console.error('WebSocket connection error', error);
      }
    );

    const statusSub = this.wsService.connectionStatus$.subscribe(status => {
      this.connectionStatus = status;
    });
    this.subscriptions.push(statusSub);
  }

  private subscribeToChat(): void {
    this.wsService.subscribe(`/topic/chat.${this.chatId}`, (message) => {
      this.messages.push(message);
      setTimeout(() => this.scrollToBottom(), 100);
    });

    this.wsService.subscribe(`/topic/chat.${this.chatId}.members`, (members: string[]) => {
      this.members = members;
    });
  }

  sendMessage(): void {
    if (!this.currentUserId) {
      this.validationError = 'You must be logged in to send messages';
      return;
    }

    if (!this.newMessage.trim()) {
      this.validationError = 'Message cannot be empty';
      return;
    }

    this.validationError = '';

    const message = {
      content: this.newMessage.trim(),
      userId: this.currentUserId
    };

    this.wsService.send(`/app/chat.${this.chatId}`, message);
    this.newMessage = '';
  }

  leaveChat(): void {
    if (this.currentUserId) {
      this.wsService.send(`/app/chat.${this.chatId}.leave`, {
        content: '',
        userId: this.currentUserId
      });
    }
    this.chatService.leaveChat(this.chatId, this.currentUserId).subscribe({
      next: () => this.router.navigate(['/chats']),
      error: () => this.router.navigate(['/chats'])
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuHidden = !this.mobileMenuHidden;
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
