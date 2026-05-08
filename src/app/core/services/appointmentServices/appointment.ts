import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  bookConsultation(doctorId: string, patientId: string, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/doctors/${doctorId}/book_appointment/${patientId}`,
      data
    );
  }
  showAppointments(doctorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors/${doctorId}/appointments`);
  }
}
