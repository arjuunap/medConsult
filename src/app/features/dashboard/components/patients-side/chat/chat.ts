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
import { AuthService } from '../../../../../core/services/authServices/auth';


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
    private websocketService: WebSocketService,
    private authService: AuthService,
   
  ) {}
  currentUserId: any;
  ngOnInit(): void {
    console.log('Chat component initialized with consultation ID:', this.consultationId);
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    // this.consultationId = id;
    // this.loadMessages();
    // }

    const token = localStorage.getItem('token');
    const currentUser = this.loadUser();
    if (token) {
      this.websocketService.connect(token, () => {
        this.websocketService.subscribeToConsultation(this.consultationId, (message: any) => {
          console.log('Received:', message);

          message.self = message.senderId === this.currentUserId;

          this.messages.push(message);

          this.cd.detectChanges();

          this.scrollToBottom();
        });
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

  loadUser(): void {
    this.authService.UserDetails().subscribe({
      next: (res) => {
        console.log('user:', res);
        // assuming API returns array

        this.loadMessages();
        this.currentUserId = res.id;

        console.log('shduhd', res.id);

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('user error:', err);
      },
    });
  }

  loadMessages(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
    this.websocketService.getMessages(this.consultationId).subscribe({
      next: (res) => {
        this.messages = res.map((msg: any) => ({
          ...msg,

          self: msg.senderId === this.currentUserId,
        }));

        this.cd.detectChanges();

        this.scrollToBottom();
      },

      error: (err) => {
        console.error(err);
      },
    });
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
      const container = document.getElementById('chat-body');

      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/layout/doctors']);
  }
}