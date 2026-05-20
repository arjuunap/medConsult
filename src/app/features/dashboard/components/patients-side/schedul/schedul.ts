import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';

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
  showSuccessPopup = false;
  selectedSchedule: any;

  // 🔥 Form
  bookingForm!: FormGroup;
  schedules: any[] = [];
  date = new Date();



  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // ✅ get doctor id
    this.doctorId = this.route.snapshot.paramMap.get('id')!;

    // ✅ fetch schedules
    if (this.doctorId) {
      this.doctorService.getScheduleByDoctorId(this.doctorId).subscribe({
        next: (res: any) => {
          this.doctor = Array.isArray(res) ? res : [res];
          this.schedules = this.doctor;
          console.log(this.schedules)

          // default load today schedules
          this.filterSchedulesByDate(this.date)
          // console.log("===", this.filterSchedulesByDate(new Date()))

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
      notes: this.bookingForm.value.notes,
    };
    console.log("🔥 Sending payload:", payload);

    this.doctorService.bookConsultation(this.doctorId, payload).subscribe({
      next: (res) => {

        console.log('Booking successful', res);
        this.showBookingForm = false;
        setTimeout(() => {
          this.showSuccessPopup = true;
          this.cd.detectChanges();
        }, 0);
        // this.router.navigate(['layout/home']);
        this.closeBooking();

      },
      error: (err) => console.error('Booking failed', err),
    });
  }

  // navigation (optional)
  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  selectedDate = new Date();



  filteredSchedules: any[] = []

  filterSchedulesByDate(selectedDate: Date | string) {


    const currentDate = new Date(selectedDate);

    currentDate.setHours(0, 0, 0, 0);

    const selectedDay = currentDate
      .toLocaleDateString('en-US', {
        weekday: 'long'
      })
      .toUpperCase();

    console.log(selectedDay);

    this.filteredSchedules = this.schedules.filter(schedule => {

      const from = new Date(schedule.effectiveFrom);
      const until = new Date(schedule.effectiveUntil);

      from.setHours(0, 0, 0, 0);
      until.setHours(0, 0, 0, 0);

      return (
        schedule.dayOfWeek === selectedDay &&
        currentDate >= from && currentDate <= until
      );

    });

    // sort by start time
    this.filteredSchedules.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    console.log("Filtered schedules", this.filteredSchedules);
  }
}
