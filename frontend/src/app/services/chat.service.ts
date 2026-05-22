import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, ChatListItem } from '../models/chat.model';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getChats(): Observable<ChatListItem[]> {
    return this.http.get<ChatListItem[]>(`${this.apiUrl}/chats`);
  }

  createChat(name: string, userId?: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chats`, { name, userId });
  }

  getMessages(chatId: number, userId?: number): Observable<Message[]> {
    const options = userId ? { headers: new HttpHeaders({ 'X-User-Id': userId.toString() }) } : {};
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages`, options);
  }

  getMembers(chatId: number, userId?: number): Observable<string[]> {
    const options = userId ? { headers: new HttpHeaders({ 'X-User-Id': userId.toString() }) } : {};
    return this.http.get<string[]>(`${this.apiUrl}/chats/${chatId}/members`, options);
  }

  leaveChat(chatId: number, userId?: number): Observable<void> {
    if (!userId) return new Observable(obs => obs.complete());
    return this.http.delete<void>(`${this.apiUrl}/chats/${chatId}/members/${userId}`);
  }
}