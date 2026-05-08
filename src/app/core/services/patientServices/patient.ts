import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  registerPatient(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/patients/register', data);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl + '/patients/all');
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }
  getPatientByDoctorId(doctorId: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/doctors/${doctorId}/patients`);
  }
}
