import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WebSocketService } from '../../../../../core/services/webSocketServices/web-socket';
import { AuthService } from '../../../../../core/services/authServices/auth';

@Component({
  selector: 'app-case-room-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './case-room.html',
  styleUrl: './case-room.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseRoomChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatBody')
  chatBody!: ElementRef;

  caseId: string = '';

  currentUserId: string = '';

  message: string = '';

  messages: any[] = [];

  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('caseId') || '';

    this.loadCurrentUser();

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    this.websocketService.connect(
      token,

      () => {
        this.subscribeToRoom();
        this.loadOldMessages();
      },
    );
  }

  loadCurrentUser(): void {
    this.authService.UserDetails().subscribe({
      next: (res: any) => {
        console.log('dfff', res);
        this.currentUserId = res.id;
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  subscribeToRoom(): void {
    this.websocketService.subscribeToCaseRoom(
      this.caseId,

      (message: any) => {
        console.log('Incoming Message:', message);

        message.self = message.authorId === this.currentUserId;

        console.log('user idd ', this.currentUserId);

        this.messages.push(message);

        this.cd.detectChanges();

        this.scrollToBottom();
      },
    );
  }

  loadOldMessages(): void {
    this.websocketService.getCaseRoomMessages(this.caseId).subscribe({
      next: (res: any) => {
        this.messages = res.map((msg: any) => ({
          ...msg,

          self: msg.authorId === this.currentUserId,
        }));

        console.log('Loaded Messages:', this.messages);

        this.cd.detectChanges();

        this.scrollToBottom();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }

    const payload = {
      caseId: this.caseId,

      content: this.message,
    };

    this.websocketService.sendCaseMessage(payload);

    this.message = '';

    this.cd.detectChanges();
  }

  isSelf(message: any): boolean {
    return message.senderId === this.currentUserId;
  }

  scrollToBottom(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (this.chatBody) {
          this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
        }
      }, 50);
    });
  }

  goBack(): void {
    this.router.navigate(['/layout/case-rooms']);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}