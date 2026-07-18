import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { HttpClient } from '@angular/common/http';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: Client;
  private notificationSubject = new Subject<any>();

  public notifications$: Observable<any> = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(BASIC_URL + 'ws'),
      reconnectDelay: 5000,
      debug: (msg: string) => console.log(msg)
    });
  }

  getUnreadNotifications(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/notifications/unread', {
      headers: this.createAuthorizationHeader()
    });
  }

  markNotificationsAsRead(): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/notifications/mark-read', {}, {
      headers: this.createAuthorizationHeader(),
    });
  }

  connectAdmin(): void {
    this.stompClient.connectHeaders = this.createAuthorizationHeader();

    this.stompClient.onConnect = (frames) => {
      console.log('Connected to WebSocket server');

      this.stompClient.subscribe('/topic/admin/notifications', (message: Message) => {
        if (message.body) {
          const notification = JSON.parse(message.body);
          this.playAudioAlert();
          this.notificationSubject.next(notification);
        }
      });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };
    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  public playAudioAlert(): void {
    const audio = new Audio('assets/notification.wav');
    audio.play().catch(err => {
      console.warn('Audio blocked by browser. User must interact with the page first.', err);
    });
  }

  private createAuthorizationHeader(): { [key: string]: string } {
    return {
      Authorization: 'Bearer ' + UserStorageService.getToken()
    };
  }
}
