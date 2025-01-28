// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/RegisterRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Cambia la URL si es necesario

  constructor(private http: HttpClient) {}

  register(registerData: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, registerData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  requestPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password`, data);
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}
