import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DoctorService } from '../services/doctor';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private doctorService: DoctorService,
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // ✅ Password Match Validator
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  //show password
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // toggleConfirmPassword() {
  //   this.showConfirmPassword = !this.showConfirmPassword;
  // }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
  
    

    const { confirmPassword, ...formData } = this.registerForm.value;
console.log(formData)     //print cheyn//
    this.doctorService.registerUser(formData).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.successMsg = 'Registration successful';
        this.errorMsg = '';
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg = 'Registration failed';
      },
    });
  }
}
