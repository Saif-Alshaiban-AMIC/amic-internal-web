import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DevRequest {
  id: number;
  requesterName: string;
  requesterEmail: string;
  department: string;
  appName: string;
  appType: string;
  description: string;
  priority: string;
  targetDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface CreateDevRequestPayload {
  requesterName: string;
  requesterEmail: string;
  department: string;
  appName: string;
  appType: string;
  description: string;
  priority: string;
  targetDate: string | null;
}

export interface UpdateDevRequestPayload {
  status: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class DevRequestService {

  private base = environment.apiUrl + '/api/dev-requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DevRequest[]> {
    return this.http.get<DevRequest[]>(this.base);
  }

  create(payload: CreateDevRequestPayload): Observable<DevRequest> {
    return this.http.post<DevRequest>(this.base, payload);
  }

  update(id: number, payload: UpdateDevRequestPayload): Observable<DevRequest> {
    return this.http.put<DevRequest>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
