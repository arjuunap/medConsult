import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../../../core/services/webSocketServices/web-socket';




@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
 

  consultationId: string = 'eef7c6bd-9f3a-4628-a772-8ec3fde3e044';
  
  messages: any[] = [];
 
  message: string = '';
  isTyping: boolean = false;
  isSending: boolean = false;
  MessageType = 'TEXT';
  

  private typingTimer: any;
  private shouldScrollToBottom: boolean = false;

  // emojis: string[] = ['😊', '👍', '🙏', '❤️', '😔', '💊', '🩺', '✅', '⚠️', '📋'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private websocketService: WebSocketService
  ) {}
currentUserId: string = localStorage.getItem('userId') || '';
  ngOnInit(): void {
    console.log('Chat component initialized with consultation ID:', this.consultationId);
     // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
      // this.consultationId = id;
      // this.loadMessages();
    // }
    const token = localStorage.getItem('token');
    if (token) {
      this.websocketService.connect(token, () => {

        this.websocketService
            .subscribeToConsultation(

          this.consultationId,

          (message: any) => {

            console.log(
              'Received:',
              message
            );

            this.messages.push(
              message
            );

            this.cd.detectChanges();

            this.scrollToBottom();
          }
        );
      });
    } else {
      console.error('No token found, cannot connect to WebSocket');
    }
  }

  // Add your current user's senderId here


isSelf(msg: any): boolean {
  return msg.senderId === this.currentUserId;
}



  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  loadMessages(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  sendMessage() {
        console.log('Chat component initialized with consultation ID:', this.consultationId);

    if (!this.message.trim()) {
      return;
    }
    console.log(this.messages);

    const chatMessage = {
      consultationId: this.consultationId,
      content: this.message,
      messageType: 'TEXT',
    };

    this.websocketService.sendMessage(chatMessage);

    // this.messages.push({
    //   self: true,
    //   content: this.message,
    // });

    this.message = '';
    this.scrollToBottom();
  }

  scrollToBottom() {

    setTimeout(() => {

      const container =
        document.getElementById(
          'chat-body'
        );

      if (container) {

        container.scrollTop =
          container.scrollHeight;
      }

    }, 100);
  }

 

 


  goBack(): void {
    this.router.navigate(['/layout/doctors']);
  }


}