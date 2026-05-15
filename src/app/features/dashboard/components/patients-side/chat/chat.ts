import { Component } from '@angular/core';
import { WebSocketService } from '../../../../../core/services/webSocketServices/web-socket';
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

  consultationId = 'YOUR_CONSULTATION_UUID';

  constructor(private websocketService: WebSocketService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.websocketService.connect(token);
    }
  }

  sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    const chatMessage = {
      consultationId: this.consultationId,

      content: this.message,

      messageType: 'TEXT',
    };

    this.websocketService.sendMessage(chatMessage);

    this.messages.push({
      self: true,
      content: this.message,
    });

    this.message = '';
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}