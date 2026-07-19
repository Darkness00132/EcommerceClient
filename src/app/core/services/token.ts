import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../store/authStore';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly authState = inject(AuthStore);

  private readonly roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  getEmail(): string | null {
    const payload = this.decodePayload();

    return payload?.email ?? null;
  }

  getRoles(): string[] {
    const payload = this.decodePayload();

    if (!payload) return [];

    const roles = payload[this.roleClaim];

    if (!roles) return [];

    return Array.isArray(roles) ? roles : [roles];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private decodePayload(): any | null {
    const token = this.authState.getAccessToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // restore padding
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }

      const decoded = atob(base64);
      // handle UTF-8 characters correctly (atob is Latin1-only)
      const jsonPayload = decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
