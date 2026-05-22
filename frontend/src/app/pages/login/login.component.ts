import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Enter SimpleChat</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" (keyup.enter)="login()">
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="login()" [disabled]="!username.trim()">
            Enter
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    mat-card {
      width: 300px;
      padding: 24px;
    }
  `]
})
export class LoginComponent {
  username = '';

  constructor(private router: Router) {}

  login(): void {
    if (this.username.trim()) {
      // TODO: integrate with AuthService
      this.router.navigate(['/chats']);
    }
  }
}