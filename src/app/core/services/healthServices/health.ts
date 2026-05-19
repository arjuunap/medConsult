import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
   constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/health';

  prescriptionRegister(prescriptionData: any, consultationId: string) {
    return this.http.post(`${this.apiUrl}/prescription/${consultationId}/add`, prescriptionData);
  }

}
