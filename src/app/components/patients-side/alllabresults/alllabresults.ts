import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctorServices/doctor';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alllabresults',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './alllabresults.html',
  styleUrl: './alllabresults.css',
})
export class Alllabresults {
labResults: any[] = [];

  constructor(private labService:DoctorService,
              private cd: ChangeDetectorRef,
              
              private router: Router,
   ) {}


    ngOnInit(): void {
      
    this.loadResults();
    
  }

  goTolabresult(patientId: string) {
    if (!patientId) return;
    this.router.navigate(['/labresults', patientId]);
  }



   loadResults() {
  this.labService.getPatients()
    .subscribe((res:any) => {
      console.log('this is', res);
      this.labResults = res  ?? [];
      this.cd.detectChanges();  
    });
}



}
