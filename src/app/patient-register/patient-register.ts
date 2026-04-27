import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DoctorService } from '../services/doctor';
import { PatientService } from '../services/patient';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-patient-register',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './patient-register.html',
  styleUrl: './patient-register.css',
})
export class PatientRegisterComponent implements OnInit {

  doctors: any[] = [];
  patientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDoctors();
  }

  initForm() {
    this.patientForm = this.fb.group({
      userId: ['c82a1aae-8aa1-4a6f-a1f3-990cc0673cec'],
      patientCode: [''],
      dateOfBirth: [''],
      gender: [''],
      bloodType: [''],
      nationalId: [''],

      medicalHistory: [''],
      allergies: [[]],
      chronicConditions: [[]],

      insuranceProvider: [''],
      policyNumber: [''],
      insuranceExpiry: [''],

      contactName: [''],
      contactPhone: [''],

      doctorId: [''],
      notes: ['']
    });
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (res: any) => {
        this.doctors = Array.isArray(res) ? res : [];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onCheckboxChange(event: any, field: string) {
    const values = this.patientForm.get(field)?.value || [];

    if (event.target.checked) {
      values.push(event.target.value);
    } else {
      const index = values.indexOf(event.target.value);
      if (index >= 0) values.splice(index, 1);
    }

    this.patientForm.get(field)?.setValue(values);
  }

  submitPatient() {
    const formData = this.patientForm.value;

    console.log('Sending:', formData);

    this.patientService.registerPatient(formData).subscribe({
      next: (res) => {
        console.log('Success:', res);
        alert('Patient registered successfully!');
        this.patientForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error while saving patient');
      }
    });
  }
}
