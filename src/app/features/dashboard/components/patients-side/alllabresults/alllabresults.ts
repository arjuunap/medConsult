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

@Component({
  selector: 'app-alllabresults',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './alllabresults.html',
  styleUrl: './alllabresults.css',
})
export class Alllabresults {
labResults: any[] = [];

  constructor(private patientService: PatientService,
              private cd: ChangeDetectorRef,
              
              private router: Router,
   ) {}


    ngOnInit(): void {
      
    this.loadResults();
    
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
  this.patientService.getPatients()
    .subscribe((res:any) => {
      console.log('this is', res);
      this.labResults = res  ?? [];
      this.cd.detectChanges();  
    });
}



}
