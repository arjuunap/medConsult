import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../services/doctor';

// ── Form Model (UI Binding) ─────────────────────────
interface VitalForm {
  heartRate: number | null;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  spo2: number | null;
  temperature: number | null;
  glucose: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  recordedByUserId: string;
}

// ── API Request Model (Backend Mapping) ─────────────
interface VitalRequest {
  heartRateBpm: number | null;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  spo2Percent: number | null;
  temperatureC: number | null;
  bloodGlucoseMmol: number | null;
  weightKg: number | null;
  heightCm: number | null;
  bmi: number | null;
  recordedByUserId: string;
}

@Component({
  selector: 'app-record-vitals',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './health-vital.html',
  styleUrls: ['./health-vital.css']
})
export class HealthVital {

  submitted = false;
  success = false;
  errors: string[] = [];

  // 🔥 Form Data
  form: VitalForm = {
    heartRate: null,
    bpSystolic: null,
    bpDiastolic: null,
    spo2: null,
    temperature: null,
    glucose: null,
    weight: null,
    height: null,
    bmi: null,
    recordedByUserId: '9247f357-31a1-4d8c-808d-254c196cb38d'
  };

  // 🔥 Patient ID (dynamic later)
  patientId = '75d2c2f6-2faa-46c0-b7c5-ee9647e44b53';

  constructor(
    private http: HttpClient,
    private doctorService: DoctorService
  ) {}

  // ── BMI Calculation ───────────────────────────────
  calculateBMI(): void {
    const w = this.form.weight;
    const h = this.form.height;

    if (w && h && w > 0 && h > 0) {
      const heightInMeters = h / 100;
      this.form.bmi = parseFloat(
        (w / (heightInMeters * heightInMeters)).toFixed(1)
      );
    } else {
      this.form.bmi = null;
    }
  }

  // ── Validation (Range Only) ───────────────────────
  private validate(): boolean {
    this.errors = [];

    if (this.form.heartRate != null &&
        (this.form.heartRate < 30 || this.form.heartRate > 220)) {
      this.errors.push('Heart Rate must be between 30 and 220 bpm.');
    }

    if (this.form.bpSystolic != null &&
        (this.form.bpSystolic < 60 || this.form.bpSystolic > 250)) {
      this.errors.push('BP Systolic must be between 60 and 250 mmHg.');
    }

    if (this.form.bpDiastolic != null &&
        (this.form.bpDiastolic < 40 || this.form.bpDiastolic > 150)) {
      this.errors.push('BP Diastolic must be between 40 and 150 mmHg.');
    }

    if (this.form.spo2 != null &&
        (this.form.spo2 < 70 || this.form.spo2 > 100)) {
      this.errors.push('SpO₂ must be between 70 and 100%.');
    }

    if (this.form.temperature != null &&
        (this.form.temperature < 34 || this.form.temperature > 42)) {
      this.errors.push('Temperature must be between 34 and 42 °C.');
    }

    if (this.form.glucose != null &&
        (this.form.glucose < 1 || this.form.glucose > 30)) {
      this.errors.push('Blood glucose must be between 1 and 30 mmol/L.');
    }

    if (this.form.weight != null &&
        (this.form.weight < 10 || this.form.weight > 300)) {
      this.errors.push('Weight must be between 10 and 300 kg.');
    }

    if (this.form.height != null &&
        (this.form.height < 50 || this.form.height > 250)) {
      this.errors.push('Height must be between 50 and 250 cm.');
    }

    return this.errors.length === 0;
  }

  // ── Submit Form ───────────────────────────────────
  submitForm(): void {
    this.submitted = true;
    this.success = false;

    if (!this.validate()) return;

    const payload: VitalRequest = {
      heartRateBpm: this.form.heartRate,
      bpSystolic: this.form.bpSystolic,
      bpDiastolic: this.form.bpDiastolic,
      spo2Percent: this.form.spo2,
      temperatureC: this.form.temperature,
      bloodGlucoseMmol: this.form.glucose,
      weightKg: this.form.weight,
      heightCm: this.form.height,
      bmi: this.form.bmi,
      recordedByUserId: this.form.recordedByUserId
    };

    this.doctorService.registerVital(payload, this.patientId).subscribe({
      next: (res) => {
        this.success = true;
        this.errors = [];

        // console.log('Vitals saved successfully', payload);
        console.log('Vitals saved successfully', res);

        setTimeout(() => (this.success = false), 3000);
      },
      error: (err) => {
        console.error('Failed to save vitals:', err);
        this.errors = ['Failed to save. Please try again.'];
      }
    });
  }

  // ── Reset Form ────────────────────────────────────
  resetForm(): void {
    this.submitted = false;
    this.success = false;
    this.errors = [];

    this.form = {
      heartRate: null,
      bpSystolic: null,
      bpDiastolic: null,
      spo2: null,
      temperature: null,
      glucose: null,
      weight: null,
      height: null,
      bmi: null,
      recordedByUserId: ''
    };
  }
}