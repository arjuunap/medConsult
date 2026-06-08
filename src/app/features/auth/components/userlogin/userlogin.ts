import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../../../core/services/doctorServices/doctor';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/authServices/auth';

@Component({
  selector: 'app-userlogin',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css',
})
export class Userlogin {
  showPassword = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  togglePassword() {

    this.showPassword = !this.showPassword;
  }
  googleLogin() {
    this.authService.googleLogin()
  }

  onSubmit() {
    if (this.loginForm.invalid) return;


    const { email, password } = this.loginForm.value;


    this.authService.userLogin({ email, password }).subscribe({
      next: (res: any) => {
        this.successMsg = 'Logged in successfully!';
        localStorage.setItem('token', res.token);
        this.router.navigate(['/layout']);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMsg = err?.error?.message || 'Login failed';
        this.successMsg = '';
      }
    });
  }
}
