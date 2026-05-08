import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment implements OnInit {

  appointments: any[] = [];
  doctorId: string = '6bc2ece1-ff1e-45f0-b14e-6a6387abdf21';
  

  constructor(
    private appomentService : AppointmentService,
     private cd : ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.appomentService.showAppointments(this.doctorId).subscribe({
        next: (res) => {
          console.log('appointments',res)
          this.appointments = res;
          this.cd.detectChanges()
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        },
      });
  }
}