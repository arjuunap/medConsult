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
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';

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
  consultationId: string = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private doctorService: DoctorService,
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      console.log('Selected File:', this.selectedFile);
    }
  }

  ngOnInit(): void {


    this.caseId = this.route.snapshot.paramMap.get('caseId') || '';
    this.consultationId = this.route.snapshot.paramMap.get('consultationId') || '';
    this.getConsultationDetails();
    this.loadCurrentUser();

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    // this is a comment .

    this.websocketService.connect(
      token,

      () => {
        this.subscribeToRoom();
        this.loadOldMessages();
      },
    );
  }
  getConsultationDetails() {
    this.doctorService.getConsultationDetails(this.consultationId).subscribe({
      next: (res) => {
        console.log('resPPPPPPrrr', res);


        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
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
    if (!this.message.trim() && !this.selectedFile) {
      return;
    }

    const payload: any = {
      caseId: this.caseId,
      content: this.message,
    };

    // If file selected
    if (this.selectedFile) {
      this.websocketService.uploadCaseFile(this.selectedFile, this.caseId).subscribe({
        next: (fileResponse) => {
          console.log('File Upload Response:', fileResponse);

          const payload = {
            caseId: this.caseId,
            content: this.message,
            fileId: fileResponse.id,
            fileName: fileResponse.fileName,
            fileUrl: fileResponse.fileUrl,
            messageType: 'FILE'
          };
          this.websocketService.sendCaseMessage(payload);

          this.message = '';
          this.selectedFile = null;
        },

        error: (err) => {
          console.error(err);
        },
      });

      return;
    }

    this.websocketService.sendCaseMessage(payload);
    console.log('Sent Message Payload:', payload);

    this.message = '';
    this.selectedFile = null;

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
    this.router.navigate(['/layout/case-room-list']);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}