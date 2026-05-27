import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private apiUrl = 'http://localhost:8080/ws';


 constructor(private http: HttpClient) {}

 
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

  getMessages(
    consultationId: string
  ) {

    return this.http.get<any[]>(

      `http://localhost:8080/api/chat/${consultationId}/messages`
    );
  }

  disconnect() {
    this.stompClient.deactivate();
  }

  subscribeToCaseRoom(
  caseId: string,
  callback: (message: any) => void
) {

  this.stompClient.subscribe(

    `/topic/case-room/${caseId}`,

    (message) => {

      callback(
        JSON.parse(message.body)
      );
    }
  );
}


sendCaseMessage(message: any) {

  this.stompClient.publish({

    destination:
      '/app/case-chat.send',

    body: JSON.stringify(message),
  });
}

getCaseRoomMessages(caseId: string) {

  return this.http.get(

    `${this.apiUrl}/case-rooms/${caseId}/messages`

  );
}


createRoom(data: any) {
  return this.http.post(
    'http://localhost:8080/api/consultation/create',
    data
  );
}
}

