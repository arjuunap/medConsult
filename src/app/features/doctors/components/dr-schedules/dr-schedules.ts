import { Component } from '@angular/core';
import { DoctorService } from '../../../../core/services/doctorServices/doctor';

@Component({
  selector: 'app-dr-schedules',
  imports: [],
  templateUrl: './dr-schedules.html',
  styleUrl: './dr-schedules.css',
})
export class DrSchedules {
  constructor(private doctorService: DoctorService) {}
  doctorId: string = '6bc2ece1-ff1e-45f0-b14e-6a6387abdf21';

  ngOnInit(): void {  
    this.doctorService.schedules(this.doctorId).subscribe({
      next: (res) => {
        console.log('schedules', res);
      },
      error: (err) => {
        console.error('Error fetching schedules', err);
      },
    });

  }
}
