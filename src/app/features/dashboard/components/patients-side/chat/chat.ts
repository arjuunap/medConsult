import { Component } from '@angular/core';
import { WebSocket } from '../../../../../core/services/webSocketServices/web-socket';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',

})
export class Chat {
    messages: any[] = [];

  message = '';

  constructor(
    private websocketService: WebSocket
  ) {}

  ngOnInit(): void {
    this.websocketService.connect((message) => {
      console.log(message);
      this.messages.push(message);
    });
  }

  sendMessage() {

    const chatMessage = {
      sender: 'Akshai',
      content: this.message,
      type: 'CHAT'
    };
    this.websocketService.sendMessage(chatMessage);
    this.message = '';
  }
}