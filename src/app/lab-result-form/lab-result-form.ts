import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { finalize } from 'rxjs/operators';
import { DoctorService } from '../services/doctor';

/* ── Types ──────────────────────────────────────────────────────── */
export interface Patient {
  patientId: string;
  user: {
    fullName: string;
  };
  gender?: string;
}

 export interface Doctor {
  id: string;
  name: string;
  department?: string;
}

interface LabItem {
  testName: string;
  value: string;
  unit: string;
  referenceMin: string;
  referenceMax: string;
}

interface LabResultPayload {
  patient: string;
  orderedBy: string;
  panelName: string;
  testDate: string;
  labSource: string;
  labItems: LabItem[];
}

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-lab-result-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab-result-form.html',
  styleUrls: ['./lab-result-form.css'],
  animations: [
    trigger('slideItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0, transform: 'translateY(-4px)' })),
      ]),
    ]),
    trigger('fadeToast', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LabResultSubmissionComponent implements OnInit {

  labForm!: FormGroup;

  patients: Patient[] = [];
  doctors: Doctor[]  = [];

  loadingPatients = false;
  loadingDoctors  = false;
  submitting      = false;

  toastMessage: string | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /* ── Replace these with your real API base URL ─────────────────── */
  

  constructor(private fb: FormBuilder, private http: HttpClient,
    private doctorService: DoctorService, private cd: ChangeDetectorRef 
  ) {}

  /* ── Lifecycle ──────────────────────────────────────────────────── */
  ngOnInit(): void {
    this.buildForm();
    this.fetchPatients();
    this.fetchDoctors();
    this.setTodayDate();
  }

  /* ── Form Build ─────────────────────────────────────────────────── */
  private buildForm(): void {
    this.labForm = this.fb.group({
      patient:     ['', Validators.required],
      patientId:   [{ value: '', disabled: true }],
      orderedBy:   ['', Validators.required],
      // orderedById: [{ value: '', disabled: true }],
      panelName:   ['', [Validators.required, Validators.minLength(2)]],
      testDate:    ['', Validators.required],
      labSource : [''],
      labItems:    this.fb.array([this.createLabItem()]),
    });
  }

  private createLabItem(data?: Partial<LabItem>): FormGroup {
    return this.fb.group({
      testName:     [data?.testName     ?? '', Validators.required],
      value:        [data?.value        ?? '', Validators.required],
      unit:         [data?.unit         ?? 'mg/dL'],
      referenceMin: [data?.referenceMin ?? ''],
      referenceMax: [data?.referenceMax ?? ''],
    });
  }

  /* ── FormArray Accessor ─────────────────────────────────────────── */
  get labItems(): FormArray {
    return this.labForm.get('labItems') as FormArray;
  }

  /* ── Dynamic Lab Items ──────────────────────────────────────────── */
  addLabItem(): void {
    this.labItems.push(this.createLabItem());
  }

  removeLabItem(index: number): void {
    if (this.labItems.length > 1) {
      this.labItems.removeAt(index);
    }
  }

  /* ── Range Status ───────────────────────────────────────────────── */
  getRangeStatus(item: AbstractControl): 'low' | 'high' | 'normal' | null {
    const val = parseFloat(item.get('value')?.value);
    const min = parseFloat(item.get('referenceMin')?.value);
    const max = parseFloat(item.get('referenceMax')?.value);

    if (isNaN(val) || isNaN(min) || isNaN(max)) return null;
    if (val < min) return 'low';
    if (val > max) return 'high';
    return 'normal';
  }

  /* ── Fetch Patients ─────────────────────────────────────────────── */
  private fetchPatients(): void {
    this.loadingPatients = true;
    this.doctorService.getPatients().subscribe({
      next:  (data) => {
        this.patients = data;
        this.loadingPatients = false;
        this.cd.detectChanges();
        console.log('Fetched patients:', data);
      },
      error: () => {
        this.showToast('Failed to load patients.');
        this.loadingPatients = false;
        console.error('Error fetching patients');
      },
    })
  }

  /* ── Fetch Doctors ──────────────────────────────────────────────── */
  private fetchDoctors(): void {
    this.loadingDoctors = true;
    this.doctorService.getDoctors().subscribe({
      next:  (data) => {
        this.doctors = data;
        this.loadingDoctors = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load doctors.');
        this.loadingDoctors = false;
      },
    })
  }

  /* ── Dropdown Handlers ──────────────────────────────────────────── */
  onPatientSelect(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.labForm.patchValue({ patientId: id });
  }

  onDoctorSelect(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.labForm.patchValue({ orderedById: id });
  }

  /* ── Validation Helpers ─────────────────────────────────────────── */
  isInvalid(controlName: string): boolean {
    const ctrl = this.labForm.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  isItemInvalid(index: number, field: string): boolean {
    const ctrl = this.labItems.at(index)?.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  /* ── Submit ─────────────────────────────────────────────────────── */
  onSubmit(): void {
    if (this.labForm.invalid) {
      this.labForm.markAllAsTouched();
      return;
    }

    const raw = this.labForm.getRawValue();

    const payload: LabResultPayload = {
      patient:   raw.patient,
      orderedBy: raw.orderedBy,
      panelName: raw.panelName,
      testDate:  raw.testDate,
      labItems:  raw.labItems,
      labSource: raw.labSource,
    };

    this.submitting = true;

    this.doctorService.registerLabResult(payload).subscribe({
      next: (res) => {
        this.showToast('Lab result submitted successfully!');
        this.resetForm();
        console.log('Lab result submission response:', res);
      },
      error: () => {
        this.showToast('Failed to submit lab result.');
        console.error('Error submitting lab result');
      },
      complete: () => (this.submitting = false),
    })

  }

  /* ── Reset ──────────────────────────────────────────────────────── */
  resetForm(): void {
    this.labForm.reset();
    while (this.labItems.length > 0) {
      this.labItems.removeAt(0);
    }
    this.labItems.push(this.createLabItem());
    this.setTodayDate();
  }

  /* ── Helpers ─────────────────────────────────────────────────────── */
  private setTodayDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.labForm.patchValue({ testDate: today });
  }

  private showToast(message: string, duration = 3000): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastTimer = setTimeout(() => (this.toastMessage = null), duration);
  }
}
