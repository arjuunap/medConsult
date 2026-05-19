import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import { AuthService } from '../../../../../core/services/authServices/auth';
import { VitalsService } from '../../../../../core/services/vitalServices/vitals';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';
import { PatientService } from '../../../../../core/services/patientServices/patient';
import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
 
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class HomeComponent {

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private vitalsService: VitalsService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  // =========================
  // VARIABLES
  // =========================

  patient: any = {};
  vitals: any = {};
  doctor: any = {};

  role: string = '';

  vital: boolean = false;

  Patients: any[] = [];

  appointments: any[] = [];

  totalPatients: number = 0;

  selectedPatient: any = null;
  
  selectedAppointment: any = null;

  showCancelPopup: boolean = false;

  cancelReason: string = '';

  priority: string = 'NORMAL';

  today = new Date();

  // =========================
  // DASHBOARD STATS
  // =========================

  stats = {
    activePatients: 0,
    patientsDelta: 12,
    todayConsults: 0,
    pendingConsults: 0,
    openCases: 7,
    criticalCases: 2,
    labResults: 31,
    unreviewedLabs: 9
  };

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.authService.UserDetails().subscribe({

      next: (res) => {

        this.role = res?.role || '';

        console.log('ROLE : ', this.role);

        if (this.role === 'DOCTOR') {

          this.loadPatients();

          this.loadAppointments();

        } else {

          this.router.navigate(['/layout/patient-dashboard']);

        }

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  // =========================
  // LOAD PATIENTS
  // =========================

  loadPatients(): void {

    this.patientService.getPatientByDoctorId().subscribe({

      next: (patients) => {

        this.Patients = patients ?? [];

        this.totalPatients = this.Patients.length;

        this.stats.activePatients = this.totalPatients;

        console.log('Patients : ', this.Patients);

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  loadAppointments(): void {

    this.appointmentService.showTodayAppointments().subscribe({

      next: (res: any) => {
        console.log('nokkadad ingott',res)

         this.appointments = res.data ?? res ?? [];

        console.log('Appointments : ', this.appointments);

        this.stats.todayConsults = this.appointments.length;

        this.stats.pendingConsults =
          this.appointments.filter(
            (a: any) => a.status === 'SCHEDULED'
          ).length;

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  // =========================
  // PATIENT MODAL
  // =========================

  openModal(patient: any): void {

    this.selectedPatient = patient;

  }

  closeModal(): void {

    this.selectedPatient = null;

  }

  // =========================
  // APPOINTMENT MODAL
  // =========================

  openAppointmentModal(appt: any): void {
    console.log('apt popup',appt)

    this.selectedAppointment = appt;

    this.priority = appt.priority || 'NORMAL';

  }

  closeAppointmentModal(): void {

    this.selectedAppointment = null;

  }

  // =========================
  // CANCEL POPUP
  // =========================

 

  // =========================
  // UPDATE STATUS
  // =========================

  updateStatus(status: string): void {

    const payload = {

      status:status,

      priority: this.priority

    };
    console.log(payload);

    this.appointmentService
      .updateAppointment(
        this.selectedAppointment.appointmentId,
        payload
      )
      .subscribe({

        next: () => {

          console.log('update cheyan vannth',this.selectedAppointment)
          this.closeAppointmentModal();

          this.loadAppointments();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // =========================
  // HELPERS
  // =========================

  getInitials(fullName: string): string {

    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('');

  }

  getAvatarColor(name: string): string {

    const colors = [
      'av-blue',
      'av-pink',
      'av-amber',
      'av-teal'
    ];

    let sum = 0;

    for (let i = 0; i < name.length; i++) {

      sum += name.charCodeAt(i);

    }

    return colors[sum % colors.length];

  }

  // =========================
  // APPOINTMENT TYPE CLASS
  // =========================

  getTypeClass(type: string): string {
    switch (type) {
      case 'Follow-up':
        return 'followup';

      case 'NewConsult':
        return 'consult';

      case 'Referral':
        return 'referral';

      default:
        return '';
    }
  }

  // =========================
  // STATUS CLASS
  // =========================

  getStatusClass(status: string): string {

    switch (status) {

      case 'SCHEDULED':
        return 'status-scheduled';

      case 'CONFIRMED':
        return 'status-confirmed';

      case 'COMPLETED':
        return 'status-completed';

      case 'NO_SHOW':
        return 'status-noshow';

      default:
        return '';

    }

  }

}