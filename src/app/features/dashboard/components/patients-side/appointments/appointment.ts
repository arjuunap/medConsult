import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';
import { AuthService } from '../../../../../core/services/authServices/auth';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment implements OnInit {
  appointments: any[] = [];

  selectedAppointment: any = null;

  role: string = '';

  // PRIORITY
  priority: string = 'NORMAL';

  // CANCEL POPUP
  showCancelPopup: boolean = false;

  cancelReason: string = '';

  constructor(
    private appomentService: AppointmentService,
    private cd: ChangeDetectorRef,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.getAppointments();

    this.authservice.UserDetails().subscribe({
      next: (res) => {
        this.role = res.role;

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  getAppointments() {
    this.appomentService.showAppointments().subscribe({
      next: (res) => {
        this.appointments = res;
        console.log('Appointments :', res);

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // CARD CLICK
  openAppointment(appt: any) {
    const doctorId = appt.doctorId;

    const appointmentId = appt.appointmentId;

    this.appomentService
      .showAppointmentsById(doctorId, appointmentId)
      .subscribe({
        next: (res) => {
          this.selectedAppointment = res;

          // existing priority load
          this.priority = res.priority || 'NORMAL';

          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  closeModal() {
    this.selectedAppointment = null;

  }

  // CONFIRM
  updateStatus(status: string) {
    const appointmentId = this.selectedAppointment.appointmentId;

    const payload = {
      status: status,
      priority: this.priority,
    };

    this.appomentService
      .updateAppointment(appointmentId, payload)
      .subscribe({
        next: (res) => {
          console.log('updated', res);

          this.selectedAppointment.status = status;
          this.selectedAppointment.priority = this.priority;

          const index = this.appointments.findIndex(
            (a) => a.appointmentId === appointmentId
          );

          if (index !== -1) {
            this.appointments[index].status = status;
            this.appointments[index].priority = this.priority;
          }

          this.closeModal();
          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });

  }

  // OPEN CANCEL POPUP
  openCancelPopup() {
    this.showCancelPopup = true;
  }

  // CLOSE CANCEL POPUP
  closeCancelPopup() {
    this.showCancelPopup = false;
    this.cancelReason = '';
    this.cd.detectChanges();
  }

  // FINAL CANCEL
  confirmCancel() {
    const appointmentId = this.selectedAppointment.appointmentId;

    const payload = {
      status: 'CANCELLED',
      cancelReason: this.cancelReason,
    };

    this.appomentService
      .updateAppointment(appointmentId, payload)
      .subscribe({
        next: (res) => {
          console.log('cancelled', res);

          this.selectedAppointment.status = 'CANCELLED';
          
          this.selectedAppointment.cancelReason = this.cancelReason;

          const index = this.appointments.findIndex(
            (a) => a.appointmentId === appointmentId
          );

          if (index !== -1) {
            this.appointments[index].status = 'CANCELLED';
            this.appointments[index].cancelReason = this.cancelReason;
          }

          this.closeCancelPopup();
          this.closeModal();
          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }
}