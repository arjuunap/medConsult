import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cases {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  getCaseList() {
    return this.http.get(`${this.apiUrl}/consultation/caserooms`);
  }
}
