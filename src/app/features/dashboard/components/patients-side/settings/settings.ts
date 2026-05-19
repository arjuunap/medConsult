import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HealthService }
from '../../../../../core/services/healthServices/health';
import { AuthService } from '../../../../../core/services/authServices/auth'


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {

  prescriptions: any[] = [];

  selectedPrescription: any = null;

  showConfirmModal = false;

  showReasonModal = false;

  skippedReason = '';

  taken = false;


  constructor(
    private healthService: HealthService,
    private cd: ChangeDetectorRef,
    private authService : AuthService
  ) {}
  user : any = [];
  patientId : string = ''

  ngOnInit(): void {

  this.authService.UserDetails().subscribe({
    next: (res) => {
      this.user = res;

      console.log('user details', this.user);

      this.patientId = this.user.patientId;

      

      this.getAllPrescriptions();
    },
    error: (err) => {
      console.log(err);
    }
  });

}
  

  getAllPrescriptions(): void {
    this.patientId = this.user.patientId
    console.log("Patient id",this.patientId)

    this.healthService
      .getPrescriptions(this.patientId)
      .subscribe({

        next: (res: any) => {

          console.log('Prescriptions:', res);

          this.prescriptions = res.map((p: any) => ({

            ...p,

            completed: null,

            reason: ''

          }));

          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Error fetching prescriptions:',
            err
          );
        }
      });
  }

  openPrescriptionModal(
    prescription: any
  ): void {

    this.selectedPrescription =
      prescription;
    console.log("res",prescription)

    this.showConfirmModal = true;
  }

  markCompleted(): void {

    const adherance = {
          skippedReason : null,
          taken : true
        }
        console.log("tt",adherance)
    this.healthService.addAdherance(adherance).subscribe({
      next:(res)=>{
        console.log("completed",res)
      },
      error:(err)=>{
        console.log('error')
      }
    })
  

    this.showConfirmModal = false;
  }

  openReasonModal(): void {

    this.showConfirmModal = false;

    this.showReasonModal = true;
  }


  submitReason(): void {
        const adherance = {
          skippedReason : this.skippedReason,
          taken : this.taken
        }

        console.log('ad',adherance)
    
     
    console.log("miss reason",this.skippedReason)
    this.healthService.addAdherance(adherance).subscribe({
      next:(res)=>{
        console.log('res',res)

      },
      error:(err)=>{
        console.log('err',err)

      }
    })

    this.showReasonModal = false;

    this.skippedReason = '';
  }

  closeModal(): void {

    this.showConfirmModal = false;

    this.showReasonModal = false;
  }
}