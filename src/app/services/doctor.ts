import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://192.168.1.22:8080/api'; // ⚠️ backend URL

  constructor(private http: HttpClient) {}

  // registerDoctor(data: any): Observable<any> {
  //   return this.http.get(this.apiUrl, data);
  // }
  getAllDoctors() {
    return this.http.get(this.apiUrl + "/doctors/all");
  }
  // getUsers() {
  //   return this.http.get(this.apiUrl + '/auth/users');.
  // }
  getDoctor() {
    return this.http.get(this.apiUrl + '/doctors/956335d4-1eee-49b0-ae0d-b1ed77d0903e');
  }

  // saveUser(){
  //   return this.http.post(this.apiUrl + '/register');
  // }
   registerUser(data: any) {
    return this.http.post(this.apiUrl + '/auth/register', data);
  }
  registerDoctor(data:any){
    return this.http.post(this.apiUrl + '/doctors/register', data);

  }

}