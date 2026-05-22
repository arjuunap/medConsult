import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../../models/auth-response';
import { UserDetailsResponse } from '../../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router : Router) { }

  private apiUrl = 'http://localhost:8080/api/auth';

  registerUser(data: any) {
    return this.http.post<AuthResponse>(this.apiUrl + '/register', data);
  }
  googleLogin() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
  googleRegister() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  googlelogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  userLogin(data: any) {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', data);
  }

  logout() {

    localStorage.removeItem('token');
    // window.location.href = '/login';
    this.router.navigate(['/login']);
  }
  UserDetails(){
    return this.http.get<UserDetailsResponse>(this.apiUrl + '/me');
  }
  updateProfile(data: any) {
    return this.http.put('http://localhost:8080/api/patients/update-profile', data);
  }
}
