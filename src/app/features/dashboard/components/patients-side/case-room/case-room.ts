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
  @ViewChild('chatBody') chatBody!: ElementRef;

  caseId: string = '';
  consultationId: string = '';
  currentUserId: string = '';
  
  message: string = '';
  messages: any[] = [];
  
  isSending: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private doctorService: DoctorService,
  ) {}

  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('caseId') || '';
    this.consultationId = this.route.snapshot.paramMap.get('consultationId') || '';
    
    this.getConsultationDetails();
    this.loadCurrentUser();

    // Fetch initial case files
    this.websocketService.getCaseFiles(this.caseId).subscribe({
      next: (files) => console.log('Case Files:', files),
      error: (err) => console.error('Error fetching case files:', err),
    });

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    this.websocketService.connect(token, () => {
      this.subscribeToRoom();
      this.loadOldMessages();
    });
  }

  consultationDetails: any | null = null;
isLoadingDetails = false;

getConsultationDetails() {
  this.isLoadingDetails = true;
  this.doctorService.getConsultationDetails(this.consultationId).subscribe({
    next: (res: any) => {
      this.consultationDetails = res;
      this.isLoadingDetails = false;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Error fetching consultation:', err);
      this.isLoadingDetails = false;
      this.cd.detectChanges();
    },
  });
}

  loadCurrentUser(): void {
    this.authService.UserDetails().subscribe({
      next: (res: any) => {
        this.currentUserId = res.id;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  subscribeToRoom(): void {
    this.websocketService.subscribeToCaseRoom(
      this.caseId,
      (message: any) => {
        // Standardize the self check. Ensure we use senderId consistently based on your logs.
        message.self = message.senderId === this.currentUserId;
        this.messages.push(message);
        this.cd.detectChanges();
        this.scrollToBottom();
      },
    );
  }

  loadOldMessages(): void {
  this.websocketService.getCaseRoomMessages(this.caseId).subscribe({
    // Change any[] to any here 👇
    next: (res: any) => {
      this.messages = res.map((msg: any) => ({
        ...msg,
        self: msg.senderId === this.currentUserId,
      }));
      this.cd.detectChanges();
      this.scrollToBottom();
    },
    error: (err) => console.error(err),
  });
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  sendMessage(): void {
    if (!this.message.trim() && !this.selectedFile) return;

    this.isSending = true;

    // File Upload Scenario
    if (this.selectedFile) {
      this.websocketService.uploadCaseFile(this.selectedFile, this.caseId).subscribe({
        next: (fileResponse) => {
          const payload = {
            caseId: this.caseId,
            content: fileResponse.fileUrl,
            fileId: fileResponse.id || fileResponse.fileId,
            fileName: fileResponse.fileName || this.selectedFile?.name,
            fileUrl: fileResponse.fileUrl,
            mimeType: fileResponse.mimeType || this.selectedFile?.type,
            messageType: 'FILE'
          };
          
          this.websocketService.sendCaseMessage(payload);
          this.resetInput();
        },
        error: (err) => {
          console.error('File upload failed:', err);
          this.isSending = false;
        },
      });
      return;
    }

    // Text Message Scenario
    const payload = {
      caseId: this.caseId,
      content: this.message,
      messageType: 'TEXT'
    };

    this.websocketService.sendCaseMessage(payload);
    this.resetInput();
  }

  private resetInput(): void {
    this.message = '';
    this.selectedFile = null;
    this.isSending = false;
    this.cd.detectChanges();
  }

  // Helper to determine if a file is an image or document
  isImageFile(msg: any): boolean {
    if (msg.mimeType) {
      return msg.mimeType.startsWith('image/');
    }
    // Fallback regex if MIME type isn't provided
    const url = msg.fileUrl || msg.content || '';
    return !!url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
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

  // Add these inside your CaseRoomChatComponent class

  isImage(content: string): boolean {
    if (!content) return false;
    // Checks if the string ends with an image extension
    return !!content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i);
  }

  isDocument(content: string): boolean {
    if (!content) return false;
    // Checks if the string ends with a document extension
    return !!content.match(/\.(pdf|doc|docx|txt|xls|csv)(\?.*)?$/i);
  }
}