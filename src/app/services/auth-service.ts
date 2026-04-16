import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
  }
}