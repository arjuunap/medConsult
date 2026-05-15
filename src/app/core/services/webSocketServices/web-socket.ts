import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {

  private stompClient: Client | null = null;

  connect() {

    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      }
    });

    this.stompClient.onConnect = () => {

      console.log('Connected');

      this.stompClient?.subscribe('/topic/public', (message) => {
        console.log(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error:', frame);
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