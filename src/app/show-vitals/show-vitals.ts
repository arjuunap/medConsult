import { Component, OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../services/doctor';
import { Router } from '@angular/router';
export interface VitalsData {
  bloodGlucoseMmol: number;
  bmi: number;
  bpDiastolic: number;
  bpSystolic: number;
  heartRateBpm: number;
  heightCm: number;
  spo2Percent: number;
  temperatureC: number;
  weightKg: number;
}

@Component({
  selector: 'app-vitals-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-vitals.html',
  styleUrls: ['./show-vitals.css'],
})
export class VitalsDetailComponent implements OnChanges {

  patientId : string = '9621af97-b7e5-4801-bbc8-92fb08c732cb'; // Default patient ID for testing

  // Emits patientId when Edit Vitals is clicked — parent decides what to do
 

  

  vitals: VitalsData | null = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient,
              private doctorService: DoctorService,
              private cd: ChangeDetectorRef,
              private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    
      this.fetchVitals();
      this.cd.detectChanges();
      
    
  }
  ngOnInit(): void {
    this.fetchVitals();
    this.cd.detectChanges();
    
  } 

  private fetchVitals(): void {
    this.loading = true;
    this.error   = null;
    this.vitals  = null;

    this.doctorService.showVitals(this.patientId).subscribe({
      next: (data) => {
        this.vitals = data;
        console.log('Fetched vitals:', data);
        console.log("patient id",this.patientId)
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load vitals. Please try again.';
        console.error('Error fetching vitals:', err);
      },
      complete: () => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

 onEdit(): void {
  this.router.navigate(['/edit-vitals', this.patientId]);
}

  retry(): void {
    this.fetchVitals();
    this.cd.detectChanges();
  }

  /* ── Blood Pressure ───────────────────────────────────────────── */
  getBpStatus(): string {
    const s = this.vitals!.bpSystolic;
    const d = this.vitals!.bpDiastolic;
    if (s < 120 && d < 80) return 'badge--normal';
    if (s < 130 && d < 80) return 'badge--warning';
    if (s < 140 || d < 90) return 'badge--warning';
    return 'badge--danger';
  }
  getBpLabel(): string {
    const s = this.vitals!.bpSystolic;
    const d = this.vitals!.bpDiastolic;
    if (s < 120 && d < 80) return 'Normal';
    if (s < 130 && d < 80) return 'Elevated';
    if (s < 140 || d < 90) return 'High Stage 1';
    return 'High Stage 2';
  }

  /* ── Heart Rate ───────────────────────────────────────────────── */
  getHrStatus(): string {
    const hr = this.vitals!.heartRateBpm;
    if (hr >= 60 && hr <= 100) return 'badge--normal';
    if (hr >= 50 && hr < 60)   return 'badge--warning';
    return 'badge--danger';
  }
  getHrLabel(): string {
    const hr = this.vitals!.heartRateBpm;
    if (hr >= 60 && hr <= 100) return 'Normal';
    if (hr < 60)               return 'Low';
    return 'High';
  }

  /* ── SpO2 ─────────────────────────────────────────────────────── */
  getSpo2Status(): string {
    const s = this.vitals!.spo2Percent;
    if (s >= 95)            return 'badge--normal';
    if (s >= 90 && s < 95) return 'badge--warning';
    return 'badge--danger';
  }
  getSpo2Label(): string {
    const s = this.vitals!.spo2Percent;
    if (s >= 95)            return 'Normal';
    if (s >= 90 && s < 95) return 'Low';
    return 'Critical';
  }

  /* ── Temperature ──────────────────────────────────────────────── */
  getTempStatus(): string {
    const t = this.vitals!.temperatureC;
    if (t >= 36.1 && t <= 37.2) return 'badge--normal';
    if (t > 37.2 && t <= 38.0)  return 'badge--warning';
    return 'badge--danger';
  }
  getTempLabel(): string {
    const t = this.vitals!.temperatureC;
    if (t >= 36.1 && t <= 37.2) return 'Normal';
    if (t > 37.2 && t <= 38.0)  return 'Mild Fever';
    if (t > 38.0)                return 'Fever';
    return 'Low';
  }

  /* ── Blood Glucose ────────────────────────────────────────────── */
  getGlucoseStatus(): string {
    const g = this.vitals!.bloodGlucoseMmol;
    if (g >= 3.9 && g <= 5.6) return 'badge--normal';
    if (g > 5.6 && g <= 7.0)  return 'badge--warning';
    return 'badge--danger';
  }
  getGlucoseLabel(): string {
    const g = this.vitals!.bloodGlucoseMmol;
    if (g >= 3.9 && g <= 5.6) return 'Normal';
    if (g > 5.6 && g <= 7.0)  return 'Pre-diabetic';
    if (g > 7.0)               return 'High';
    return 'Low';
  }

  /* ── BMI ──────────────────────────────────────────────────────── */
  getBmiStatus(): string {
    const b = this.vitals!.bmi;
    if (b >= 18.5 && b < 25.0) return 'badge--normal';
    if (b >= 25.0 && b < 30.0) return 'badge--warning';
    return 'badge--danger';
  }
  getBmiLabel(): string {
    const b = this.vitals!.bmi;
    if (b < 18.5)             return 'Underweight';
    if (b >= 18.5 && b < 25) return 'Normal';
    if (b >= 25 && b < 30)   return 'Overweight';
    return 'Obese';
  }
}