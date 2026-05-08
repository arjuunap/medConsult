import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { PatientService } from '../../../../../core/services/patientServices/patient';
import { AuthService } from '../../../../../core/services/authServices/auth';

@Component({
  selector: 'app-alllabresults',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './alllabresults.html',
  styleUrl: './alllabresults.css',
})
export class Alllabresults {

  labResults: any[] = [];

  role: string = '';
  userId: string = '';

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.authService.UserDetails().subscribe({
      next: (user: any) => {

        console.log('Logged User:', user);

        this.role = user.role;
        this.userId = user.userId;

        this.loadResults();

      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });

  }

  goTolabresult(patientId: string) {

    console.log(patientId);

    if (!patientId) return;

    this.router.navigate(['/layout/all-lab-results', patientId]);

  }

  loadResults() {

    // DOCTOR LOGIN
    if (this.role === 'DOCTOR') {

      this.patientService.getPatientByDoctorId(this.userId)
        .subscribe({
          next: (res: any) => {

            console.log('Doctor Patients:', res);

            this.labResults = res ?? [];

            this.cd.detectChanges();

          },
          error: (err) => {
            console.error(err);
          }
        });

    }
    // PATIENT LOGIN
    else if (this.role === 'PATIENT') {

      this.patientService.getPatients()
      .subscribe({
        next: (res: any[]) => {

          console.log('All Patients:', res);

          this.labResults = res.filter(
            (patient: any) => patient.user?.id === this.userId
          );

          console.log('Filtered Patients:', this.labResults);

          this.cd.detectChanges();

        },
        error: (err) => {
          console.error(err);
        }
      });

    }

  }

}