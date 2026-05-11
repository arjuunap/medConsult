import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';
import { VitalsService } from '../../../../../core/services/vitalServices/vitals';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';
import { PatientService } from '../../../../../core/services/patientServices/patient';


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
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {

  }
  patient: any = {}
  vitals: any = {}
  role: string = ''
  doctor: any = {}
  vital: boolean = false;
  Patients: any[] = [];
  totalPatients : number = 0;
  ngOnInit(): void {
    this.patientService.getPatientByDoctorId().subscribe({
    next: (res) => {
      this.Patients = res;
      console.log('Patients :', res);
      this.totalPatients = res.length;

      this.cd.detectChanges();
    },

    error: (err) => {
      console.error(err);
    },
  });
  }

  getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('');
}

getAvatarColor(name: string): string {
  const colors = [
    'av-blue',
    'av-pink',
    'av-amber',
    'av-teal'
  ];

  let sum = 0;

  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return colors[sum % colors.length];
}

//   registerAsPatient() {
//     this.router.navigate(['/patient-register'])

//   }
//   ngOnInit(): void {
//   // this.doctorService.
//   this.authService.UserDetails().subscribe({
//     next: (res) => {

//       this.patient = res;
//       this.role = res.role;

//       console.log('User Details :', res);
//       console.log('Role :', this.role);

//       this.cd.detectChanges();

//       // ✅ MOVE INSIDE HERE
//       if (this.role === 'PATIENT') {

//         this.vitalsService.getVitals().subscribe({
//           next: (vitals) => {

//             this.vitals = vitals;

//             console.log('Vitals :', vitals);

//             this.vital = true;
//             this.cd.detectChanges();
//           },

//           error: (err) => {
//             console.error('Error fetching vitals:', err);
//           }
//         });

//       }

//     },

//     error: (err) => {
//       console.error('Error fetching user details:', err);
//     },

//   });

// }
today = new Date();

  // Replace with actual API data later
  stats = {
    activePatients: 284,
    patientsDelta: 12,
    todayConsults: 18,
    pendingConsults: 4,
    openCases: 7,
    criticalCases: 2,
    labResults: 31,
    unreviewedLabs: 9
  };

  


}

