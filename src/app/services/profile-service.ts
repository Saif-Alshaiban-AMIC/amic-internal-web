import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  jobTitle: string;
  profilePicture: string | null;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.baseUrl + '/api/profile');
  }

  updateProfile(payload: ProfileUpdateRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.baseUrl + '/api/profile', payload);
  }
}