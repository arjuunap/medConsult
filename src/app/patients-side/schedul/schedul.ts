import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor';

@Component({
  selector: 'app-schedul',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './schedul.html',
  styleUrls: ['./schedul.css'],
})
export class Schedul implements OnInit {
  doctor: any[] = [];
  doctorId!: string;

  // 🔥 Booking popup
  showBookingForm = false;
  selectedSchedule: any;

  // 🔥 Form
  bookingForm!: FormGroup;

  // ⚠️ Replace later with logged-in user
  patientId = '9621af97-b7e5-4801-bbc8-92fb08c732cb';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // ✅ get doctor id
    this.doctorId = this.route.snapshot.paramMap.get('id')!;

    // ✅ fetch schedules
    if (this.doctorId) {
      this.doctorService.getscheduleById(this.doctorId).subscribe({
        next: (res: any) => {
          this.doctor = Array.isArray(res) ? res : [res];
          this.cd.detectChanges();
        },
        error: (err) => console.error(err),
      });
    }

    // ✅ init booking form
    this.bookingForm = this.fb.group({
      location: ['', Validators.required],
      appointmentType: ['', Validators.required],
      scheduledAt: ['', Validators.required],
       notes: ['', Validators.required] 
    });
  }

  // 🔥 open popup
  openBooking(schedule: any) {
    this.selectedSchedule = schedule;
    this.showBookingForm = true;
    this.bookingForm.reset();
  }

  // 🔥 close popup
  closeBooking() {
    this.showBookingForm = false;
  }

  // 🔥 submit booking
  submitBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const payload = {
       location: this.bookingForm.value.location,
      appointmentType: this.bookingForm.value.appointmentType,
      scheduledAt: this.bookingForm.value.scheduledAt + ':00',
      notes:this.bookingForm.value.notes,
    };
    console.log("🔥 Sending payload:", payload);

    this.doctorService.bookConsultation(this.doctorId, this.patientId, payload).subscribe({
      next: (res) => {
        console.log('Booking successful', res);
        this.router.navigate(['layout/home']);
        this.closeBooking();
      },
      error: (err) => console.error('Booking failed', err),
    });
  }

  // navigation (optional)
  goToSchedule() {
    this.router.navigate(['/schedule']);
  }
}
