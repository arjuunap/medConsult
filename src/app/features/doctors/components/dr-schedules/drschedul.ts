import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../../core/services/doctorServices/doctor';
// import { DoctorService} from 

@Component({
  selector: 'app-drschedul',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './drschedul.html',
  styleUrls: ['./drschedul.css'],
})
export class Drschedul implements OnInit {
  doctor: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {

  }
  // doctorId: string ='8b83fb0e-bd66-4d11-99c2-7c9d59d961aa';

  ngOnInit(): void {
    // this.doctorId = this.route.snapshot.paramMap.get('id')!;

    // if (!this.doctorId) return;

    this.doctorService.schedules().subscribe({
      next: (res: any) => {
        this.doctor = Array.isArray(res) ? res : [res];
        this.cd.detectChanges();
        console.log('Schedules fetched successfully', res);
      },
      error: (err) => console.error(err),
    });
  }
  goToAddSchedule() {
    this.router.navigate(['/layout/add-schedule']);
  }

  deleteSchedule(scheduleId: string) {
    // Implement delete functionality here
    this.doctorService.deleteSchedule(scheduleId).subscribe({
      next: (res) => {
        console.log('Schedule deleted successfully', res);
        // Optionally, refresh the schedule list after deletion
        this.ngOnInit();
      }
    });
  }
}
