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
  showAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors/appointments`);
  }
  showAppointmentsById(doctorId: string, appointmentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctors/${doctorId}/appointments/${appointmentId}`);
  }

updateAppointment(appointmentId: string, body: any): Observable<any> {

  return this.http.put(
    `${this.apiUrl}/doctors/appointments/${appointmentId}`,
    body
  );
}

getLatestAppointments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/patients/next-appointments`);
}
}