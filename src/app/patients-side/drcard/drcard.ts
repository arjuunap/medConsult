import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-drcard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './drcard.html',
  styleUrls: ['./drcard.css'],
})
export class Drcard implements OnInit {
  doctors: any[] = [];

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private cd : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    
  }
  goToProfile(id: number) {
    this.router.navigate(['/layout/drprofile', id]);
    
  }
  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
        console.log('Doctors loaded:', res);
        this.cd.detectChanges()
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }
}
