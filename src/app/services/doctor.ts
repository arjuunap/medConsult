import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../lab-result-form/lab-result-form';
import { Patient } from '../lab-result-form/lab-result-form';
import { VitalsData } from '../show-vitals/show-vitals';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://192.168.1.22:8080/api'; // ⚠️ backend URL

  constructor(private http: HttpClient) { }


  // registerDoctor(data: any): Observable<any> {
  //   return this.http.get(this.apiUrl, data);
  // }
  // getAllDoctors() {
  //   return this.http.get(this.apiUrl + "/doctors/all");
  // }
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
  registerDoctor(data: any) {
    return this.http.post(this.apiUrl + '/doctors/register', data);

  }
  registerPatient(data: any) {
    return this.http.post(this.apiUrl + '/patients/register', data);
  }


  userLogin(data: any) {
    return this.http.post(this.apiUrl + '/auth/login', data);
  }
  getDoctorById(id: string) {
    return this.http.get(`${this.apiUrl}/doctors/${id}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl + '/doctors/all');
  }
  getPatients() {
    return this.http.get<Patient[]>(this.apiUrl + '/patients/all');
  }

  getscheduleById(id: string) {
    return this.http.get(`${this.apiUrl}/doctors/${id}/schedules`);
  }

  bookConsultation(doctorId: string, patientId: string, data: any) {
    return this.http.post(
      `${this.apiUrl}/doctors/${doctorId}/book_appointment/${patientId}`,
      data
    );
  }
  registerVital(data: any, patientId: string) {
    return this.http.post(
      `${this.apiUrl}/lab-result/${patientId}/vitals`
      , data);
  }
  registerLabResult(data: any) {
    return this.http.post(
      `${this.apiUrl}/lab-result/add`
      , data);
  }
  showVitals(patientId: string) {
    return this.http.get<VitalsData>(`${this.apiUrl}/lab-result/${patientId}/vitals`);
  }
  fetchVitals(vitalId: string) {
    return this.http.get<VitalsData>(`${this.apiUrl}/lab-result/${vitalId}/getVital`);
  }
  editVitals(data: any, vitalId: string) {
    return this.http.put(
      `${this.apiUrl}/lab-result/${vitalId}/vitals`
      , data);
  }

}