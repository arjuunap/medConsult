import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';
import { VitalsService } from '../../../../../core/services/vitalServices/vitals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css'],
})
export class PatientDashboard implements OnInit {

  vitals: any;
  patient: any;

  today: Date = new Date();

  constructor(private appointmentService: AppointmentService,
    private vitalService: VitalsService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVitals();
    this.loadAppointments();
  }

  loadVitals(): void {
    this.vitalService.getVitals().subscribe({
      next: (res) => {
        console.log('Vitals:', res);
        this.vitals = res;
                this.cd.detectChanges();

      },
      error: (err) => {
        console.error('Vitals error:', err);
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getLatestAppointments().subscribe({
      next: (res) => {
        console.log('Appointments:', res);
        this.patient = res
        console.log('Patient:', this.patient.patient.user.fullName);

        // assuming API returns array
        if (res && res.length > 0) {
          this.patient = res[0];
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Appointment error:', err);
      }
    });
  }

  getVitalStatus(key: string, value: number): { label: string; cls: string } {

    const ranges: any = {
      heartRateBpm:     { min: 60,   max: 100 },
      bpSystolic:       { min: 90,   max: 140 },
      bpDiastolic:      { min: 60,   max: 90 },
      spo2Percent:      { min: 95,   max: 100 },
      temperatureC:     { min: 36.1, max: 37.2 },
      bloodGlucoseMmol: { min: 3.9,  max: 7.8 },
      bmi:              { min: 18.5, max: 24.9 },
    };

    const r = ranges[key];

    if (!r || value == null) {
      return { label: 'N/A', cls: '' };
    }

    if (value < r.min || value > r.max) {
      return { label: 'Abnormal', cls: 'st-high' };
    }

    if (value >= r.max * 0.93) {
      return { label: 'Borderline', cls: 'st-warn' };
    }

    return { label: 'Normal', cls: 'st-normal' };
  }

  getBMILabel(bmi: number): string {

    if (bmi < 18.5) return 'Underweight';

    if (bmi < 25) return 'Normal';

    if (bmi < 30) return 'Overweight';

    return 'Obese';
  }

  getInitials(name: string): string {
    

    if (!name) return 'P';
    

    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  goToChat(consultationId: string): void {
    // Implement navigation to chat component, passing consultationId
    console.log('Navigating to chat with consultation ID:', consultationId);
     this.router.navigate(['layout/chat', consultationId]);  
}
}