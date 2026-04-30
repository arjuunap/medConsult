import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Schedul } from '../schedul/schedul';

@Component({
  selector: 'app-drprofile',
  standalone: true,
  imports: [CommonModule,Schedul],
  templateUrl: './drprofile.html',
  styleUrl: './drprofile.css',
})
export class Drprofile implements OnInit {

  doctor: any;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private cd : ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id from route:', id);

    if (id) {
      this.doctorService.getDoctorById(id).subscribe({
        next: (res) => {
          this.doctor = res;
          this.cd.detectChanges()
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  goToSchedule(id: number) {
    this.router.navigate(['/layout/schedule', id]);
  }
  goback(){
    console.log('Going back to doctor list');
    this.router.navigate(['/layout/doctors']);
  }
}