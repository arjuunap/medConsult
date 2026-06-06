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
  user: any;
  doctorName: any;
  patientName: string = '';
  specailiaztion: string = '';
  role: string | null = '';
  consultationId!: string;
  patientId!: string;
  currentUserId: any;
  messages: any[] = [];
  message: string = '';
  isTyping: boolean = false;
  isSending: boolean = false;
  MessageType = 'TEXT';
  vitals: any = '';
  patientDetails: any = '';
  patientUser: any = '';
  modalShow: boolean = false;
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  selectedDoctorIds: string[] = [];
  searchTerm: string = '';
  specialities: string[] = [];
  caseRoomForm = {
    specialty: '',
    title: '',
    description: '',
    priority: 'NORMAL',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private websocketService: WebSocketService,
    private authService: AuthService,
    private doctorService: DoctorService,
  ) {}

  
  ngOnInit(): void {
    this.consultationId = this.route.snapshot.paramMap.get('id') || '';

    const token = localStorage.getItem('token');

    const currentUser = this.loadUser();

    if (token) {
      this.websocketService.connect(token, () => {
        this.websocketService.subscribeToConsultation(this.consultationId, (message: any) => {
          message.self = message.senderId === this.currentUserId;

          this.messages.push(message);

          if (!message.self) {
            this.websocketService.markMessageRead(message.messageId).subscribe();
          }

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

        this.patientId = res.appointment.patient.patientId;
        this.patientName = res.appointment.patient.user.fullName;
        this.doctorName = res.appointment.doctor.name;
        this.specailiaztion = res.appointment.doctor.specialization;
        
        
        this.vitals = res.vitals;
        this.patientDetails = res.appointment.patient;
        this.patientUser = res.appointment.patient.user;

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
        this.user = res;
        // assuming API returns array
        
        this.role = res.role;
        console.log('Role in chat:', this.role);

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

        this.markConsultationAsRead(this.consultationId);

        this.cd.detectChanges();

        this.scrollToBottom();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  markConsultationAsRead(consultationId: string) {
    this.websocketService.markConsultationAsRead(consultationId).subscribe({
      next: () => console.log('Messages marked as read'),
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

  showModal() {
    this.modalShow = true;
    this.doctorService.getDoctors().subscribe({
      next: (res: any) => {
        console.log('Doctors loaded:', res);

        this.doctors = res;
        this.filteredDoctors = [...res];

        this.specialities = Array.from(
          new Set(res.map((doctor: any) => doctor.specialization)),
        ) as string[];

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  closeModal() {
    this.modalShow = false;

    this.selectedDoctorIds = [];

    this.searchTerm = '';

    this.caseRoomForm = {
      specialty: '',
      title: '',
      description: '',
      priority: 'NORMAL',
    };

    this.filteredDoctors = [...this.doctors];

    this.cd.detectChanges();
  }

  toggleDoctor(event: any, doctorId: string) {
    if (event.target.checked) {
      if (!this.selectedDoctorIds.includes(doctorId)) {
        this.selectedDoctorIds.push(doctorId);
      }
    } else {
      this.selectedDoctorIds = this.selectedDoctorIds.filter((id) => id !== doctorId);
    }

    this.cd.detectChanges();
  }

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter((doctor: any) => {
      const matchesSearch =
        doctor.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpeciality =
        !this.caseRoomForm.specialty || doctor.specialization === this.caseRoomForm.specialty;

      return matchesSearch && matchesSpeciality;
    });

    this.cd.detectChanges();
  }

  createCaseRoom() {
    if (!this.caseRoomForm.title.trim()) {
      alert('Please enter title');
      return;
    }

    if (!this.caseRoomForm.description.trim()) {
      alert('Please enter description');
      return;
    }

    if (this.selectedDoctorIds.length === 0) {
      alert('Please select at least one doctor');
      return;
    }
    const payload = {
      patientId: this.patientId,

      specialty: this.caseRoomForm.specialty,
      title: this.caseRoomForm.title,
      description: this.caseRoomForm.description,
      priority: this.caseRoomForm.priority,
      doctorIds: this.selectedDoctorIds,
    };
    console.log('Case Room Payload:', payload);

    this.websocketService.createRoom(payload).subscribe({
      next: (res: any) => {
        console.log('Case room created: ', res);

        // THIS IS YOUR GROUP CHAT ROOM ID
        const caseId = res.caseId;

        this.closeModal();

        // navigate to chat
        this.goToCaseDiscussion(caseId);

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Create room error:', err);
      },
    });
  }
}