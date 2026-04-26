import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  jobTitle: string;
  role: string;
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  department: string;
  jobTitle: string;
  role: string;
}

export interface BulkCreateResult {
  created: number;
  failed: number;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private base = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserRecord[]> {
    return this.http.get<UserRecord[]>(this.base);
  }

  create(payload: CreateUserPayload): Observable<UserRecord> {
    return this.http.post<UserRecord>(this.base, payload);
  }

  bulkCreate(payloads: CreateUserPayload[]): Observable<BulkCreateResult> {
    return this.http.post<BulkCreateResult>(`${this.base}/bulk`, payloads);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
