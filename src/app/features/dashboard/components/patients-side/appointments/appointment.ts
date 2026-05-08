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
  
  

  constructor(
    private appomentService : AppointmentService,
     private cd : ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.appomentService.showAppointments().subscribe({
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