import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChatListItem } from '../../models/chat.model';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <mat-card class="chat-item">
      <mat-card-header>
        <mat-card-title>{{ chat.name }}</mat-card-title>
        <mat-card-subtitle>{{ chat.memberCount }} members</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content *ngIf="chat.lastMessage">
        <p class="last-message">{{ chat.lastMessage.content | slice:0:50 }}</p>
        <span class="timestamp">{{ chat.lastMessage.sentAt | date:'short' }}</span>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button [routerLink]="['/chats', chat.id]">Open</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .chat-item {
      margin-top: 12px;
    }
    .last-message {
      color: #666;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .timestamp {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class ChatListItemComponent {
  @Input() chat!: ChatListItem;
}