import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Chat Room</span>
    </mat-toolbar>
    <div class="chat-content">
      <p>Chat room content - TODO</p>
    </div>
  `,
  styles: [`
    .chat-content {
      padding: 16px;
    }
  `]
})
export class ChatRoomComponent {
  goBack(): void {
    window.history.back();
  }
}