import { Component } from '@angular/core';
import {  WebSocketService } from '../../../../../core/services/webSocketServices/web-socket';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],

})
export class Chat {
    messages: any[] = [];

  message = '';

  constructor(
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.websocketService.connect();
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
