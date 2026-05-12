import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LabService } from '../../../../../core/services/labServices/lab';
import { PatientService } from '../../../../../core/services/patientServices/patient';
import { AuthService } from '../../../../../core/services/authServices/auth';

@Component({
  selector: 'app-alllabresults',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './alllabresults.html',
  styleUrl: './alllabresults.css',
})
export class Alllabresults {
  user: any = {};
  labResults: any[] = [];
  role: string = '';

  constructor(private patientService: PatientService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.user = this.authService.UserDetails().subscribe({
      next: (res) => {
        this.user = res;
        this.role = res?.role || '';
        console.log('User Details:', res);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });

   this.loadResults()
  }

  goTolabresult(patientId: string) {
    console.log(patientId)
    if (!patientId) return;
    this.router.navigate(['/layout/all-lab-results', patientId]);
  }
  addlabresult() {
    this.router.navigate(['/layout/add-lab-result']);
  }



  loadResults() {
    if (this.role == 'DOCTOR'){
      this.patientService.getPatientByDoctorId()
      .subscribe((res: any) => {
        console.log('this is', res);
        this.labResults = res ?? [];
        this.cd.detectChanges();
      });

    }
    else{
      this.router.navigate(['/layout/all-lab-results', this.user.patientId]);
    }
    
    
  }



}
