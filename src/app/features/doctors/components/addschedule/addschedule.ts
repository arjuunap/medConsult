import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../../core/services/doctorServices/doctor';


@Component({
  selector: 'app-addschedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addschedule.html',
  styleUrl: './addschedule.css',
})
export class Addschedule {
  scheduleForm: FormGroup;

  days = ['MONDAY', 'TUESDAY', ' WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private fb: FormBuilder,

    private doctorService: DoctorService,
    private route: ActivatedRoute,
  ) {
    this.scheduleForm = this.fb.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      scheduleType: ['', Validators.required],
      effectiveFrom: ['', Validators.required],
      effectiveUntil: [''],
    });
  }

  doctorId!: string;

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id')!;
  }

  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.scheduleForm.valid) {
      const payload = this.scheduleForm.value;
      console.log(payload);

      this.doctorService.registerSchedule(payload).subscribe({
        next: (res) => {
          this.successMessage = 'Schedule added successfully!';
          this.errorMessage = '';
          console.log('Schedule added successfully', res);
          this.scheduleForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add schedule. Try again.';
          this.successMessage = '';
          console.error('Error adding schedule', err);
        },
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.successMessage = '';
      console.log('Form is invalid');
    }
  }
}
