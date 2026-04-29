import { Component, Input, OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
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
  selector: 'app-vitals-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-vitals.html',
  styleUrls: ['./edit-vitals.css'],
})
export class VitalsEditComponent implements OnChanges {

  @Input() labResultId!: string;



  

  vitalsForm: FormGroup | null = null;
  private originalData: VitalsData | null = null;

  loading = false;
  submitting = false;
  error: string | null = null;
  successMessage: string | null = null;
  private successTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient,
              private doctorService: DoctorService,
              private cd: ChangeDetectorRef,
              private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    
      this.fetchVitals();
      
    
  }
  ngOnInit(): void {
    this.fetchVitals();
    this.cd.detectChanges();
  }
  /* ── Fetch existing vitals & patch form ─────────────────────────── */
  private fetchVitals(): void {
    this.loading    = true;
    this.error      = null;
    this.vitalsForm = null;

    this.doctorService.showVitals(this.labResultId).subscribe({
      next: (data) => {
        this.originalData = data;
        this.buildForm(data);
        this.loading = false;
        this.cd.detectChanges();
        console.log('Fetched vitals for editing:', data);
      },
      error: (err) => {
        this.error = 'Failed to load vitals. Please try again.';
        this.loading = false;
        this.cd.detectChanges();
        console.error('Error fetching vitals:', err);
      },
    })
  }

  /* ── Build reactive form with fetched values ────────────────────── */
  private buildForm(data: VitalsData): void {
    this.vitalsForm = this.fb.group({
      bpSystolic:       [data.bpSystolic,       [Validators.required, Validators.min(0)]],
      bpDiastolic:      [data.bpDiastolic,       [Validators.required, Validators.min(0)]],
      heartRateBpm:     [data.heartRateBpm,      [Validators.required, Validators.min(0)]],
      spo2Percent:      [data.spo2Percent,       [Validators.required, Validators.min(0), Validators.max(100)]],
      temperatureC:     [data.temperatureC,      [Validators.required, Validators.min(0)]],
      bloodGlucoseMmol: [data.bloodGlucoseMmol,  [Validators.required, Validators.min(0)]],
      bmi:              [data.bmi,               [Validators.required, Validators.min(0)]],
      weightKg:         [data.weightKg,          [Validators.required, Validators.min(0)]],
      heightCm:         [data.heightCm,          [Validators.required, Validators.min(0)]],
    });
  }

  /* ── Submit updated vitals ──────────────────────────────────────── */
  onSubmit(): void {
    if (!this.vitalsForm || this.vitalsForm.invalid) {
      this.vitalsForm?.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: VitalsData = this.vitalsForm.getRawValue();

    this.doctorService.editVitals(payload, this.labResultId).subscribe({
      next: (res) => {
        this.showSuccess('Vitals updated successfully!');
        this.originalData = payload; // Update original data to current
      },
      error: (err) => {
        console.error('Failed to update vitals:', err);
        this.error = 'Failed to update. Please try again.';
      },
      complete: () => {
        this.submitting = false;
        this.cd.detectChanges();
      }
    })
  }

  /* ── Reset to original fetched values ──────────────────────────── */
  resetForm(): void {
    if (this.originalData) {
      this.buildForm(this.originalData);
    }
  }

  retry(): void {
    this.fetchVitals();
    this.cd.detectChanges();
  }

  /* ── Validation helper ──────────────────────────────────────────── */
  isInvalid(field: string): boolean {
    const ctrl = this.vitalsForm?.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  /* ── Toast helper ───────────────────────────────────────────────── */
  private showSuccess(msg: string): void {
    if (this.successTimer) clearTimeout(this.successTimer);
    this.successMessage = msg;
    this.successTimer = setTimeout(() => (this.successMessage = null), 3500);
  }
}