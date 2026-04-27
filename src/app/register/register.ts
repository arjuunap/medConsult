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
        lastName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
  this.registerForm.get('confirmPassword')?.updateValueAndValidity();
});

this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
  this.registerForm.updateValueAndValidity();
});
  }

  // ✅ Password Match Validator
 passwordMatchValidator(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (!password || !confirmPassword) return null;

  return password === confirmPassword ? null : { mismatch: true };
}
getPasswordStrength(): number {
  const pwd = this.registerForm.get('password')?.value || '';
  if (pwd.length === 0) return 0;
 
  let score = 0;
  if (pwd.length >= 6)  score++;                        
  if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++; 
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;              
 
  return score; 
}

  //show password
 showPassword = false;
showConfirmPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

toggleConfirmPassword() {
  this.showConfirmPassword = !this.showConfirmPassword;
}



  onSubmit() {
    
    if (this.registerForm.invalid) {
      return;
    }

    const { confirmPassword, ...formData } = this.registerForm.value;
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
