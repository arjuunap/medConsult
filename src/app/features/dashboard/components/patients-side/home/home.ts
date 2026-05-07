import { Component ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private authService: AuthService,
    private cd : ChangeDetectorRef,
    private router : Router
  ){
    
  }
  patient : any = {}
  vitals : any = {}
  // patient = {
  //   initials: 'AH',
  //   name: 'Ahmed Hassan',
  //   id: 'ID 00421',
  //   nextAppt: 'Today 10:30',
  //   alert: 'HbA1c high',
  //   stats: [
  //     { label: 'Blood Pressure', value: '142/90', unit: '',     status: 'danger' },
  //     { label: 'Heart Rate',     value: '98',     unit: 'bpm',  status: 'warning' },
  //     { label: 'Blood Sugar',    value: '8.2',    unit: 'mmol', status: 'danger' },
  //     { label: 'Weight',         value: '84',     unit: 'kg',   status: 'normal' }
  //   ]
  // };

  registerAsPatient(){
    this.router.navigate(['/patient-register'])
    
  }
  ngOnInit(): void {  
    this.authService.homeUserDetails().subscribe({
      next: (res) => {
        this.patient = res;
        this.cd.detectChanges();
        console.log('User Details :', res); 
        
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
    
  }

}

  