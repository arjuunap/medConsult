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
import { ViewChild, ElementRef } from '@angular/core';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('chatBody')
  chatBody!: ElementRef;
  consultationId!: string;
  patientId!: string;

  messages: any[] = [];

  message: string = '';
  isTyping: boolean = false;
  isSending: boolean = false;
  MessageType = 'TEXT';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private doctorService: DoctorService,
  ) {}
  currentUserId: any;
  ngOnInit(): void {
    this.consultationId = this.route.snapshot.paramMap.get('id') || '';
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
    this.getConsultation();
  }

  getConsultation() {
    this.doctorService.getConsultationDetails(this.consultationId).subscribe({
      next: (res) => {
        console.log('resPPPPPP', res);
        this.patientId = res.appointment.patientId;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
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

        this.currentUserId = res.id;
        this.loadMessages();
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
        console.log(res);

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
    this.message = '';
  }

  scrollToBottom(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (this.chatBody) {
          this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
        }
      }, 0);
    });
  }

  goBack(): void {
    this.router.navigate(['/layout/chatlist']);
  }

  navigateToPrescription(): void {
    this.router.navigate(['/layout/prescription', this.consultationId]);
  }
  goToCaseDiscussion(caseId: string) {
    this.router.navigate(['/layout/case-discussion', caseId]);
  }

  createCaseRoom() {
    const payload = {
      patientId: this.patientId,
      specialty: 'Cardiology',
      title: 'Heart Failure Discussion',
      description: 'Need second opinion',
      doctorIds: ['3c9b0248-dfab-4e33-aac6-3eeed3ce7ae8', 'c1637157-3426-4028-a46f-91a4e86e8c56'],
    };

    this.websocketService.createRoom(payload).subscribe({
      next: (res: any) => {
        console.log(res);

        // THIS IS YOUR GROUP CHAT ROOM ID
        const caseId = res.caseId;

        // navigate to chat
        this.goToCaseDiscussion(caseId);
      },
    });
  }
}