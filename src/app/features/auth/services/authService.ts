import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { WebAuthResponse } from '../models/web-auth-response';
import { RegisterRequest } from '../models/register-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { CsrfTokenResponse } from '../models/csrf-token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private http = inject(HttpClient);

  login(data: LoginRequest): Observable<WebAuthResponse> {
    return this.getCsrfToken().pipe(
      switchMap(({ csrfToken }) =>
        this.http.post<WebAuthResponse>(`${this.apiUrl}/login-web`, data, {
          headers: {
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }),
      ),
    );
  }

  refreshToken(): Observable<WebAuthResponse> {
    return this.getCsrfToken().pipe(
      switchMap(({ csrfToken }) =>
        this.http.post<WebAuthResponse>(
          `${this.apiUrl}/refresh-token-web`,
          {},
          {
            headers: {
              'X-XSRF-TOKEN': csrfToken,
            },
            withCredentials: true,
          },
        ),
      ),
    );
  }

  logout(): Observable<void> {
    return this.getCsrfToken().pipe(
      switchMap(({ csrfToken }) =>
        this.http.post<void>(
          `${this.apiUrl}/logout-web`,
          {},
          {
            headers: {
              'X-XSRF-TOKEN': csrfToken,
            },
            withCredentials: true,
          },
        ),
      ),
    );
  }

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  confirmEmail(userId: string, token: string): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('token', token);
    return this.http.get<void>(`${this.apiUrl}/confirm-email`, { params });
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, data);
  }

  private getCsrfToken(): Observable<CsrfTokenResponse> {
    return this.http.get<CsrfTokenResponse>(`${this.apiUrl}/csrf-token`);
  }
}
