import { ChangeDetectorRef, Component } from '@angular/core';
import { AppointmentService } from '../../../../../core/services/appointmentServices/appointment';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultation-list',
  imports: [CommonModule],
  templateUrl: './consultation-list.html',
  styleUrl: './consultation-list.css',
})

export class ConsultationList {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  constructor(private appomentService: AppointmentService,
    private cd: ChangeDetectorRef,
    private authservice: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getAppointments();
    
  }
  getAppointments() {
    console.log("METHOD STARTED");
    this.appomentService.showAppointments().subscribe
      ({
        next: (res) => {
          console.log("API SUCCESS");
          console.log(res);
          this.appointments = res;
          this.filteredAppointments = res;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.log("API FAILED");
          console.error(err);
        },
        complete: () => {
          console.log("OBSERVABLE COMPLETED");
        }
      });

 
}


 get confirmedAppointments() {
  return this.filteredAppointments.filter(
    (appt) => appt.status === 'CONFIRMED'
  );
}
goToChat(id: string) {

  if (!id) {
    console.error('Consultation ID missing');
    return;
  }

  this.router.navigate(['/layout/chat', id]);
}

getInitials(name: string): string {

  if (!name) {
    return 'P';
  }

  return name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

}