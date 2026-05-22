import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { ChatListItem } from '../../models/chat.model';
import { ChatListItemComponent } from '../../components/chat-list-item/chat-list-item.component';
import { CreateChatDialogComponent } from '../../components/create-chat-dialog/create-chat-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
    ChatListItemComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>SimpleChat</span>
      <span class="spacer"></span>
      <span>{{ username }}</span>
    </mat-toolbar>

    <div class="container">
      <button mat-raised-button color="primary" (click)="openCreateChatDialog()">
        <mat-icon>add</mat-icon>
        Create New Chat
      </button>

      <mat-card *ngFor="let chat of chats" class="chat-card">
        <mat-card-header>
          <mat-card-title>{{ chat.name }}</mat-card-title>
          <mat-card-subtitle>{{ chat.memberCount }} members</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content *ngIf="chat.lastMessage">
          <p class="last-message">{{ chat.lastMessage.content | slice:0:50 }}...</p>
          <p class="timestamp">{{ chat.lastMessage.sentAt | date:'short' }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button [routerLink]="['/chats', chat.id]">Open</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .chat-card {
      margin-top: 16px;
    }
    .last-message {
      color: #666;
      font-size: 14px;
    }
    .timestamp {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class ChatListComponent implements OnInit {
  private chatService = inject(ChatService);
  private dialog = inject(MatDialog);

  username = 'User'; // TODO: get from AuthService
  chats: ChatListItem[] = [];

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.chatService.getChats().subscribe({
      next: (chats) => this.chats = chats,
      error: (err) => console.error('Failed to load chats', err)
    });
  }

  openCreateChatDialog(): void {
    const dialogRef = this.dialog.open(CreateChatDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chatService.createChat(result).subscribe({
          next: (chat) => {
            this.loadChats();
          },
          error: (err) => console.error('Failed to create chat', err)
        });
      }
    });
  }
}