import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VitalsData } from '../../models/vitals.model';

@Injectable({
  providedIn: 'root'
})
export class VitalsService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  registerVital(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/lab-result/add-vitals`,
      data
    );
  }

  getVitals(): Observable<VitalsData> {
    return this.http.get<VitalsData>(`${this.apiUrl}/lab-result/get-vitals/latest`);
  }

  getVitalById(vitalId: string): Observable<VitalsData> {
    return this.http.get<VitalsData>(`${this.apiUrl}/lab-result/${vitalId}/getVital`);
  }

  editVital(data: any, vitalId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/lab-result/${vitalId}/vitals`,
      data
    );
  }
  showVitals(patientId: string): Observable<VitalsData> {
    return this.http.get<VitalsData>(`${this.apiUrl}/${patientId}/get-vitals`);
  }
}
