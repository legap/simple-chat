import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-chat-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Chat</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Chat Name</mat-label>
        <input matInput [(ngModel)]="chatName" required minlength="1">
        <mat-error *ngIf="!chatName || chatName.trim().length === 0">
          Chat name is required
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!chatName || chatName.trim().length === 0">
        Create
      </button>
    </mat-dialog-actions>
  `
})
export class CreateChatDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateChatDialogComponent>);
  chatName = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.chatName && this.chatName.trim().length > 0) {
      this.dialogRef.close(this.chatName.trim());
    }
  }
}