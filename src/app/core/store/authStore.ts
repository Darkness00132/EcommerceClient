import { Injectable, signal, computed } from '@angular/core';
import { WebAuthResponse } from '../../features/auth/models/web-auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private accessToken = signal<string | null>(null);
  private expiration = signal<Date | null>(null);

  readonly isAuthenticated = computed(() => {
    const token = this.accessToken();

    if (!token) return false;

    const expiration = this.expiration();

    if (!expiration) return true;

    return expiration > new Date();
  });

  setAuth(response: WebAuthResponse): void {
    this.accessToken.set(response.accessToken);
    this.expiration.set(new Date(response.accessTokenExpiration));
  }

  clearAuth(): void {
    this.accessToken.set(null);
    this.expiration.set(null);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getExpirationDate(): Date | null {
    return this.expiration();
  }
}
