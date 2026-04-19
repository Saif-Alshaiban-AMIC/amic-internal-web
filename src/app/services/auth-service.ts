import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data, { responseType: 'text' });
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
  }
}