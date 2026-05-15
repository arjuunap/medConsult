import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
}

export interface ChatMessage {
  messageId: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  content: string;
  fileUrl?: string;
  isRead: boolean;
  messageType: MessageType;
  createdAt: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  consultationId: string = '';
  currentUserId: string = 'user-001'; // Replace with actual auth user id
  currentUserName: string = 'You';

  doctorName: string = 'Dr. Meera Sharma';
  doctorSpecialty: string = 'Cardiologist';
  doctorAvatar: string = '';
  isOnline: boolean = true;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  isSending: boolean = false;
  showEmojiPicker: boolean = false;
  MessageType = MessageType;

  private typingTimer: any;
  private shouldScrollToBottom: boolean = false;

  emojis: string[] = ['😊', '👍', '🙏', '❤️', '😔', '💊', '🩺', '✅', '⚠️', '📋'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
      // this.consultationId = id;
      this.loadMessages();
    // }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimer);
  }

  loadMessages(): void {
    // Mock messages — replace with actual service call
    console.log('hello')
    this.messages = [
      {
        messageId: '1',
        consultationId: this.consultationId,
        senderId: 'doctor-001',
        senderName: this.doctorName,
        content: 'Hello! How are you feeling today? Any updates since our last session?',
        isRead: true,
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        messageId: '2',
        consultationId: this.consultationId,
        senderId: this.currentUserId,
        senderName: this.currentUserName,
        content: 'I have been feeling a bit better, but still experiencing some chest discomfort in the mornings.',
        isRead: true,
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        messageId: '3',
        consultationId: this.consultationId,
        senderId: 'doctor-001',
        senderName: this.doctorName,
        content: 'I see. Please make sure to take your medication before breakfast. Also avoid caffeine for now.',
        isRead: true,
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        messageId: '4',
        consultationId: this.consultationId,
        senderId: this.currentUserId,
        senderName: this.currentUserName,
        content: 'Understood, thank you doctor. Should I come in for a follow-up?',
        isRead: true,
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 600000),
      },
    ];
    this.shouldScrollToBottom = true;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  sendMessage(): void {
    console.log('Sending message:', this.newMessage);
    const content = this.newMessage.trim();
    if (!content || this.isSending) return;

    this.isSending = true;
    const msg: ChatMessage = {
      messageId: Date.now().toString(),
      consultationId: this.consultationId,
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      content,
      isRead: false,
      messageType: MessageType.TEXT,
      createdAt: new Date(),
    };

    this.messages.push(msg);
    this.newMessage = '';
    this.shouldScrollToBottom = true;
    this.isSending = false;
    this.cd.markForCheck();

    // TODO: Replace with actual service call
    // this.chatService.sendMessage(msg).subscribe(...)
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
    this.simulateTyping();
  }

  simulateTyping(): void {
    // For demo purposes only
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {}, 2000);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
    this.messageInput?.nativeElement?.focus();
  }

  isOwnMessage(msg: ChatMessage): boolean {
    return msg.senderId === this.currentUserId;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDateGroup(date: Date): string {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  showDateSeparator(index: number): boolean {
    if (index === 0) return true;
    const curr = new Date(this.messages[index].createdAt).toDateString();
    const prev = new Date(this.messages[index - 1].createdAt).toDateString();
    return curr !== prev;
  }

  goBack(): void {
    this.router.navigate(['/layout/doctors']);
  }

  scrollToBottom(): void {
    try {
      const el = this.messageContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }
}