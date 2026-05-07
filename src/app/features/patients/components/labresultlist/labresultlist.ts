import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup } from '@angular/forms';
import { LabService } from '../../../../core/services/labServices/lab';

@Component({
  selector: 'app-labresultlist',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './labresultlist.html',
  styleUrl: './labresultlist.css',
})
export class Labresultlist implements OnInit {
labForm:FormGroup;

  labResults: any[] = [];
  selectedResult: any = null;
  showModal = false; // ✅ must start as false
  


  constructor(
     private fb: FormBuilder,
    private labService: LabService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { 
    this.labForm = this.fb.group({
      doctorId: ['b3e6c8be-6699-471f-b94b-097c2b538be4',],
      labStatus: ['',],
      doctorNotes: ['',]
      
    });
  }

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    console.log("Patient ID:", patientId);
    if (patientId) {
      this.loadResults(patientId);
    }
  }

  loadResults(patientId: string) {
    this.labService.getLabResults(patientId).subscribe((res) => {
      this.labResults = res;
      this.cd.detectChanges();
    });
  }

  openDetails(result: any) {
    const id = result?.labResultId || result?.id;
    if (!id) {
      console.error('Invalid ID');
      return;
    }

    this.showModal = false;
    this.selectedResult = null;
    this.cd.detectChanges();
    console.log('hello')

    this.labService.getLabResultById(id).subscribe({
      next: (res) => {
        console.log('full details',res)
        if (!res) {
          
         
          console.warn('Empty response from API');
          return;
        }
        this.selectedResult = res;
         // ✅ 👉 THIS IS THE FIX
      // this.labForm.patchValue({
      //   labStatus: res. || '',
      //   doctorNotes: res.doctorNotes || ''
      // });

        this.showModal = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API ERROR:', err);
        this.showModal = false;
        this.selectedResult = null;
        this.cd.detectChanges();
      }
    });
  }

  // ✅ this was missing — template calls (click)="closeModal()"
  closeModal() {
    this.showModal = false;
    this.selectedResult = null;
    this.cd.detectChanges();
  }

 submitStatus() {
  if (!this.selectedResult) return;

  const id = this.selectedResult.labResultId;

  const payload = {
    reviewedBy: this.labForm.value.doctorId,
    labStatus: this.labForm.value.labStatus?.toUpperCase(),
    doctorNotes: this.labForm.value.doctorNotes,
    
  };

  console.log('📦 Payload going to backend:', payload); // 👈 ADD HERE

  if (!payload.labStatus) {
    alert('Select status');
    return;
  }

  this.labService.updateLabResult(payload, id).subscribe({
    next: () => {

      console.log('successfully', payload); 

      // ✅ modal update
      this.selectedResult.labStatus = payload.labStatus;
      this.selectedResult.doctorNotes = payload.doctorNotes; // ✅ ADD THIS

      if (payload.labStatus === 'REVIEWED') {
        this.selectedResult.reviewedBy = {
          name: 'Doctor',
          specialization: 'General'
        };
      }

      // ✅ list update
      const index = this.labResults.findIndex(
        r => r.labResultId === id
      );

      if (index !== -1) {
        this.labResults[index].labStatus = payload.labStatus;
      }

      // ✅ reset form
      this.labForm.patchValue({
        labStatus: '',
        doctorNotes: ''
      });

      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Update failed', err);
    }
  });
}
}