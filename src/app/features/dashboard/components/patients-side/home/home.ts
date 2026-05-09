import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';
import { VitalsService } from '../../../../../core/services/vitalServices/vitals';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private vitalsService: VitalsService,
    private doctorService: DoctorService
  ) {

  }
  patient: any = {}
  vitals: any = {}
  role: string = ''
  doctor: any = {}
  vital: boolean = false;

  registerAsPatient() {
    this.router.navigate(['/patient-register'])

  }
  ngOnInit(): void {
  // this.doctorService.
  this.authService.UserDetails().subscribe({
    next: (res) => {

      this.patient = res;
      this.role = res.role;

      console.log('User Details :', res);
      console.log('Role :', this.role);

      this.cd.detectChanges();

      // ✅ MOVE INSIDE HERE
      if (this.role === 'PATIENT') {

        this.vitalsService.getVitals().subscribe({
          next: (vitals) => {

            this.vitals = vitals;

            console.log('Vitals :', vitals);

            this.vital = true;
            this.cd.detectChanges();
          },

          error: (err) => {
            console.error('Error fetching vitals:', err);
          }
        });

      }

    },

    error: (err) => {
      console.error('Error fetching user details:', err);
    },

  });

}

}

