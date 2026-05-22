import { Routes } from '@angular/router';
import { ChatListComponent } from './pages/chat-list/chat-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
  { path: 'chats', component: ChatListComponent },
  { path: 'chats/:id', loadComponent: () => import('./pages/chat-room/chat-room.component').then(m => m.ChatRoomComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) }
];