import { Injectable, signal, computed } from '@angular/core';
import { HttpService, HttpResult } from '../http/http.service';
import { User, AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(private readonly http: HttpService) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this._user.set(JSON.parse(stored));
    }
  }

  async lookupUser(email: string): Promise<HttpResult<AuthResponse>> {
    return this.http.get<AuthResponse>(`/users/lookup?email=${encodeURIComponent(email)}`);
  }

  async createUser(email: string): Promise<HttpResult<AuthResponse>> {
    return this.http.post<AuthResponse>('/users', { email });
  }

  setUser(user: User): void {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
}