import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  signIn(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.authUrl}/signin`, { email, password }, { withCredentials: true });
  }

  signUp(name: string, email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.authUrl}/signup`, { name, email, password }, { withCredentials: true });
  }

  currentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.authUrl}/me`, { withCredentials: true });
  }

  signOut(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/signout`, {}, { withCredentials: true });
  }
}
