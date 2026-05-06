import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  registerDoctor(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/doctors/register', data);
  }

  getDoctor(): Observable<any> {
    return this.http.get(this.apiUrl + '/doctors/956335d4-1eee-49b0-ae0d-b1ed77d0903e');
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctors/${id}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl + '/doctors/all');
  }

  getScheduleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors/${id}/schedules`);
  }
  bookConsultation(doctorId: string, patientId: string, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/doctors/${doctorId}/book_appointment/${patientId}`,
      data
    );
  }
  getScheduleByDoctorId(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors/${doctorId}/schedules`);
  }

  
}


