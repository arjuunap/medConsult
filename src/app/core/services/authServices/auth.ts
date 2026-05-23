import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../../models/auth-response';
import { UserDetailsResponse } from '../../models/user';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

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
  UserDetails() {
    return this.http.get<UserDetailsResponse>(this.apiUrl + '/me');
  }
  updateProfile(data: any) {
    return this.http.put('http://localhost:8080/api/patients/update-profile', data);
  }

  jwtHelper = new JwtHelperService();

  getToken() {
    return localStorage.getItem('token');
  }

  getDecodedToken() {

    const token = this.getToken();

    if (!token) return null;

    return this.jwtHelper.decodeToken(token);
  }

  getRole(): string {

    const decodedToken = this.getDecodedToken();

    return decodedToken?.role || '';
  }

  getUserId(): string {

    const decodedToken = this.getDecodedToken();

    return decodedToken?.userId || '';
  }

  getEmail(): string {

    const decodedToken = this.getDecodedToken();

    return decodedToken?.sub || '';
  }

  isLoggedIn(): boolean {

    const token = this.getToken();

    if (!token) return false;

    return !this.jwtHelper.isTokenExpired(token);
  }
}
