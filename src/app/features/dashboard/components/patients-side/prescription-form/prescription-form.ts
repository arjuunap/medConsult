import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HealthService } from '../../../../../core/services/healthServices/health';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './prescription-form.html',
  styleUrls: ['./prescription-form.css']
})
export class PrescriptionForm implements OnInit {

  prescriptionForm!: FormGroup;

  loading = false;

  successMessage = '';

  errorMessage = '';
  consultationId!: string ;

  constructor(
    private fb: FormBuilder,
    private healthService: HealthService,
private router: Router,
 private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
this.initializeForm();
    this.consultationId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Prescription Form Consultation ID:', this.consultationId);
  }

  /* =========================================
      INITIALIZE FORM
  ========================================= */

  initializeForm(): void {

  this.prescriptionForm = this.fb.group({

    prescriptions: this.fb.array([
      this.createPrescriptionItem()
    ])

  });

}
  

  /* =========================================
      CREATE MEDICINE ITEM
  ========================================= */

  createPrescriptionItem(): FormGroup {

    return this.fb.group({

      medicationName: [
        '',
        Validators.required
      ],

      dosage: [
        '',
        Validators.required
      ],

      frequency: [
        '',
        Validators.required
      ],

      durationDays: [
        ''
      ],

      refillsAllowed: [
        0
      ],
      
      instructions: [''],

    });
  }

  /* =========================================
      FORM ARRAY GETTER
  ========================================= */

  get prescriptions(): FormArray {

    return this.prescriptionForm.get(
      'prescriptions'
    ) as FormArray;
  }

  /* =========================================
      ADD MEDICINE
  ========================================= */

  addPrescription(): void {

    this.prescriptions.push(
      this.createPrescriptionItem()
    );
  }

  /* =========================================
      REMOVE MEDICINE
  ========================================= */

  removePrescription(index: number): void {

    if (this.prescriptions.length > 1) {

      this.prescriptions.removeAt(index);
    }
  }

  /* =========================================
      VALIDATION CHECK
  ========================================= */

  isFieldInvalid(
    index: number,
    field: string
  ): boolean {

    const control =
      this.prescriptions
        .at(index)
        .get(field);

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }

  /* =========================================
      RESET FORM
  ========================================= */

  resetForm(): void {

    this.prescriptionForm.reset();

    this.prescriptions.clear();

    this.prescriptions.push(
      this.createPrescriptionItem()
    );

    this.successMessage = '';

    this.errorMessage = '';
  }

  /* =========================================
      SUBMIT
  ========================================= */

  submit(): void {

  if (this.prescriptionForm.invalid) {

    this.prescriptionForm.markAllAsTouched();

    this.errorMessage =
      'Please fill all required fields';

    return;
  }

  this.loading = true;

  this.errorMessage = '';

  const payload = this.prescriptionForm.value.prescriptions;

  console.log('FINAL PAYLOAD:', payload);

  this.healthService
    .prescriptionRegister(
      payload,
      this.consultationId
    )
    .subscribe({

      next: (res) => {

        console.log('SUCCESS:', res);

        this.loading = false;

        this.successMessage =
          'Prescription saved successfully';

        this.resetForm();

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.errorMessage =
          'Failed to save prescription';

      }

    });
}

 
}