import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { LabService } from '../../../../core/services/labServices/lab';
import { AuthService } from '../../../../core/services/authServices/auth';

@Component({
  selector: 'app-labresultlist',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './labresultlist.html',
  styleUrl: './labresultlist.css',
})
export class Labresultlist implements OnInit {

  labForm: FormGroup;

  labResults: any[] = [];

  selectedResult: any = null;

  showModal = false;

  role: string = '';

  user: any = {};

  constructor(
    private fb: FormBuilder,
    private labService: LabService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {

    this.labForm = this.fb.group({

      labStatus: [''],

      doctorNotes: ['']

    });

  }

  ngOnInit(): void {

    // ✅ logged user details
    this.authService.UserDetails().subscribe({

      next: (res) => {

        this.user = res;

        this.role = res?.role || '';

        console.log('User Details:', res);

        this.cd.detectChanges();

      },

      error: (err) => {
        console.error('User fetch error:', err);
      }

    });

    // ✅ patient id
    const patientId = this.route.snapshot.paramMap.get('patientId');

    console.log('Patient ID:', patientId);

    if (patientId) {

      this.loadResults(patientId);

    }

  }

  // ✅ load all lab results
  loadResults(patientId: string) {

    this.labService.getLabResults(patientId).subscribe({

      next: (res) => {

        this.labResults = res ?? [];

        console.log('Lab Results:', this.labResults);

        this.cd.detectChanges();

      },

      error: (err) => {
        console.error('Lab results fetch error:', err);
      }

    });

  }

  // ✅ open modal
  openDetails(result: any) {

    const id = result?.labResultId || result?.id;

    if (!id) {

      console.error('Invalid ID');

      return;

    }

    this.showModal = false;

    this.selectedResult = null;

    this.cd.detectChanges();

    this.labService.getLabResultById(id).subscribe({

      next: (res) => {

        console.log('Full details:', res);

        if (!res) {

          console.warn('Empty response from API');

          return;

        }

        this.selectedResult = res;

        // ✅ patch existing values into form
        this.labForm.patchValue({

          labStatus: res.labStatus || '',

          doctorNotes: res.doctorNotes || ''

        });

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

  // ✅ close modal
  closeModal() {

    this.showModal = false;

    this.selectedResult = null;

    this.cd.detectChanges();

  }

  // ✅ submit review
  submitStatus() {

    if (!this.selectedResult) return;

    const id =
      this.selectedResult.labResultId ||
      this.selectedResult.id;

    // ✅ safer payload
    const payload = {

      labStatus:
        this.labForm.value.labStatus?.toUpperCase(),

      doctorNotes:
        this.labForm.value.doctorNotes,

      reviewedBy:
        this.user?.id

    };

    console.log('📦 Payload going to backend:', payload);

    if (!payload.labStatus) {

      alert('Select status');

      return;

    }

    this.labService.updateLabResult(payload, id).subscribe({

      next: () => {

        console.log('Successfully updated');

        // ✅ modal update
        this.selectedResult.labStatus =
          payload.labStatus;

        this.selectedResult.doctorNotes =
          payload.doctorNotes;

        this.selectedResult.reviewedBy = {

          id: this.user?.id,

          name:
            this.user?.fullName ||
            this.user?.name

        };

        // ✅ list update
        const index = this.labResults.findIndex(

          r =>
            r.labResultId === id ||
            r.id === id

        );

        if (index !== -1) {

          this.labResults[index].labStatus =
            payload.labStatus;

          this.labResults[index].doctorNotes =
            payload.doctorNotes;

          this.labResults[index].reviewedBy = {

            id: this.user?.id,

            name:
              this.user?.fullName ||
              this.user?.name

          };

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