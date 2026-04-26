import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

export interface AuthResponse {
  accessToken:        string;
  refreshToken:       string;
  tokenType:          string;
  expiresIn:          number;
  role:               string;
  mustChangePassword?: boolean;
  setupToken?:        string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data, { responseType: 'text' });
  }

  login(data: any) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${this.baseUrl}/auth/forgot-password?email=${encodeURIComponent(email)}`,
      {},
      { responseType: 'text' }
    );
  }

  setPassword(token: string, newPassword: string) {
    return this.http.post(
      `${this.baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`,
      {},
      { responseType: 'text' }
    );
  }

  refresh(refreshToken: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken });
  }

  logout() {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.baseUrl}/auth/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('role');
  }

  storeTokens(response: AuthResponse) {
    sessionStorage.setItem('token', response.accessToken);
    sessionStorage.setItem('refreshToken', response.refreshToken);
    sessionStorage.setItem('role', response.role);
  }
}
