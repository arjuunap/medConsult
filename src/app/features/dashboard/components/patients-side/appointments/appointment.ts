import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';
import { AuthService } from '../../../../../core/services/authServices/auth';
import th from '@angular/common/locales/th';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];

  selectedAppointment: any = null;

  role: string = '';

  priority: string = 'NORMAL';

  showCancelPopup: boolean = false;

  cancelReason: string = '';

  // FILTERS
  search: string = '';
  statusFilter: string = '';

  // STATS
  todayCount = 0;
  pendingCount = 0;
  completedCount = 0;
  cancelledCount = 0;

  loading = false;

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

  console.log("METHOD STARTED");

  this.loading = true;

  this.appomentService.showAppointments().subscribe({

    next: (res) => {

      console.log("API SUCCESS");
      console.log(res);

      this.appointments = res;
      this.filteredAppointments = res;

      // IMPORTANT
      this.calculateStats();

      this.loading = false;

      this.cd.detectChanges();
    },

    error: (err) => {

      console.log("API FAILED");
      console.error(err);

      this.loading = false;
    },

    complete: () => {
      console.log("OBSERVABLE COMPLETED");
    }

  });
}

  // STATS
  calculateStats() {
    const today = new Date().toDateString();

    this.todayCount = this.appointments.filter(
      (a) => new Date(a.scheduledAt).toDateString() === today
    ).length;
    this.cd.detectChanges();

    this.pendingCount = this.appointments.filter(
      (a) => a.status === 'SCHEDULED'
    ).length;
    this.cd.detectChanges();

    this.completedCount = this.appointments.filter(
      (a) => a.status === 'COMPLETED'
    ).length;
    this.cd.detectChanges();

    this.cancelledCount = this.appointments.filter(
      (a) => a.status === 'CANCELLED'
    ).length;
    this.cd.detectChanges();
  }

  // SEARCH + FILTER
  applyFilters() {
    this.filteredAppointments = this.appointments.filter((appt) => {
      const matchesSearch =
        appt.patient.user.fullName
          .toLowerCase()
          .includes(this.search.toLowerCase());

      const matchesStatus =
        !this.statusFilter || appt.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
    this.cd.detectChanges();
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
          console.log('Selected Appointment :', res);

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
    this.cd.detectChanges();
  }

  // STATUS UPDATE
  updateStatus(status: string) {
    const appointmentId = this.selectedAppointment.appointmentId;

    const payload = {
      status: status,
      priority: this.priority,
    };

    this.appomentService
      .updateAppointment(appointmentId, payload)
      .subscribe({
        next: () => {
          this.closeModal();
          this.cd.detectChanges();
          this.getAppointments();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // CANCEL
  openCancelPopup() {
    this.showCancelPopup = true;
  }

  closeCancelPopup() {
    this.showCancelPopup = false;
    this.cancelReason = '';
    this.cd.detectChanges();
  }

  confirmCancel() {
    const appointmentId = this.selectedAppointment.appointmentId;

    const payload = {
      status: 'CANCELLED',
      cancelReason: this.cancelReason,
    };

    this.appomentService
      .updateAppointment(appointmentId, payload)
      .subscribe({
        next: () => {
          this.closeCancelPopup();
          this.closeModal();

          this.getAppointments();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // STATUS CLASS
  getStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'scheduled';

      case 'CONFIRMED':
        return 'confirmed';

      case 'COMPLETED':
        return 'completed';

      case 'CANCELLED':
        return 'cancelled';

      case 'NO_SHOW':
        return 'no-show';

      default:
        return '';
    }
  }

  // TYPE CLASS
  getTypeClass(type: string): string {
    switch (type) {
      case 'Follow-up':
        return 'followup';

      case 'New Consult':
        return 'consult';

      case 'Referral':
        return 'referral';

      default:
        return '';
    }
  }
}