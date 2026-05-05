import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../services/doctor';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-userlogin',
  imports: [FormsModule, CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css',
})
export class Userlogin {
   showPassword = false;
  errorMsg = '';
  successMsg = '';
  
  constructor(private authService: DoctorService, private router: Router) {}
 
  loginForm = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
 
  togglePassword() {
    
    this.showPassword = !this.showPassword;
  }
  googleLogin(){
    this.authService.googleLogin()
  }
 
  onSubmit() {
  if (this.loginForm.invalid) return;
  

  const { email, password } = this.loginForm.value;
  

  this.authService.userLogin({ email, password }).subscribe({
    next: (res: any) => {
      console.log('Login success:', res);
      this.successMsg = 'Logged in successfully!';
      localStorage.setItem('token', res.token);
      this.router.navigate(['/layout']);
      console.log('res token:', res.token);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      this.errorMsg = '';
    },
    error: (err) => {
      console.error('Login error:', err);
      this.errorMsg = err?.error?.message || 'Login failed';
      this.successMsg = '';
    }
  });
}
}
