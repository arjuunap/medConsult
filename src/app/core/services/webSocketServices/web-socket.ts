import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
@Injectable({
  providedIn: 'root',
})
export class WebSocket {
  private stompClient: Client | null = null;

  connect(onMessageReceived: (message: any) => void) {

    const socket = new SockJS('http://localhost:8080/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {

      console.log('Connected');

      this.stompClient?.subscribe(
        '/topic/public',
        (message) => {
          onMessageReceived(JSON.parse(message.body));
        }
      );
    };

    this.stompClient.activate();
  }

  sendMessage(message: any) {

    this.stompClient?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }
}
