import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://192.168.1.22:8080/api/patients';

  constructor(private http: HttpClient) {}

  // POST - Register patient
  registerPatient(data: any): Observable<any> {
    return this.http.post(this.baseUrl+ '/register', data);
  }

  // GET - (optional) 
  // getPatients(): Observable<any> {
  //   return this.http.get(this.baseUrl);
  // }
}