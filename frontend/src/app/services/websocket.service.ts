import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  attempts: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private stompClient: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectTimer: any = null;

  private connectionStatusSubject = new Subject<ConnectionStatus>();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  private activeSubscriptions = new Map<string, any>();

  connect(onConnect: () => void, onError: (error: any) => void): void {
    const wsUrl = environment.wsUrl;

    this.stompClient = StompJs.Stomp.over(new SockJS(wsUrl));

    this.stompClient.onConnect = () => {
      this.reconnectAttempts = 0;
      this.connectionStatusSubject.next({ connected: true, reconnecting: false, attempts: 0 });
      onConnect();
    };

    this.stompClient.onStompError = (frame: any) => {
      this.connectionStatusSubject.next({ connected: false, reconnecting: false, attempts: 0 });
      onError(frame);
    };

    this.stompClient.onWebSocketError = (event: any) => {
      this.connectionStatusSubject.next({ connected: false, reconnecting: false, attempts: 0 });
      onError(event);
    };

    this.stompClient.onWebSocketClose = () => {
      this.connectionStatusSubject.next({ connected: false, reconnecting: true, attempts: this.reconnectAttempts });
      this.scheduleReconnect(onConnect, onError);
    };

    this.stompClient.activate();
  }

  private scheduleReconnect(onConnect: () => void, onError: (error: any) => void): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.connectionStatusSubject.next({
        connected: false,
        reconnecting: false,
        attempts: this.reconnectAttempts
      });
      return;
    }

    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.reconnectAttempts++;
    this.connectionStatusSubject.next({
      connected: false,
      reconnecting: true,
      attempts: this.reconnectAttempts
    });

    this.reconnectTimer = setTimeout(() => {
      this.connect(onConnect, onError);
    }, delay);
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      if (this.activeSubscriptions.has(destination)) {
        this.activeSubscriptions.get(destination).unsubscribe();
      }
      const subscription = this.stompClient.subscribe(destination, (message: any) => {
        callback(JSON.parse(message.body));
      });
      this.activeSubscriptions.set(destination, subscription);
    }
  }

  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(body));
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.activeSubscriptions.clear();
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.connectionStatusSubject.next({ connected: false, reconnecting: false, attempts: 0 });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
