import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  registerLabResult(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/lab-result/add`,
      data
    );
  }

  getLabResults(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lab-result/patient/${patientId}`);
  }
}
