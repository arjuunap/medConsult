import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;

  connect(token: string,
    onConnected?: () => void
  ) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => {
        console.log(str);
      },

      onConnect: () => {
        console.log('Connected');
        if (onConnected) {

          onConnected();
        }
        // this.stompClient?.subscribe('/user/queue/messages', (message) => {
        //   console.log('Received:', JSON.parse(message.body));
        // });
      },

      onStompError: (frame) => {
        console.error('Broker error:', frame);
      },
    });

    this.stompClient.activate();
  }
  subscribeToConsultation(
    consultationId: string,
    callback: (message: any) => void
  ) {

    this.stompClient.subscribe(

      `/topic/chat/${consultationId}`,

      (message) => {

        callback(
          JSON.parse(message.body)
        );
      }
    );
  }

  sendMessage(message: any) {

    if (!this.stompClient.connected) {
      console.error(
        'WebSocket not connected'
      );
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',

      body: JSON.stringify(message),
    });
  }

  disconnect() {
    this.stompClient.deactivate();
  }
}

// sendMessage(message: any) {
//   this.stompClient?.publish({
//     destination: '/app/chat.send',
//     body: JSON.stringify(message),
//   });
// }