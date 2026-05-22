import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, ChatListItem } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getChats(): Observable<ChatListItem[]> {
    return this.http.get<ChatListItem[]>(`${this.apiUrl}/chats`);
  }

  createChat(name: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chats`, { name });
  }
}