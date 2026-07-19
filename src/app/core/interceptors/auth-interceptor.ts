import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthStore } from '../store/authStore';
import { AuthService } from '../../features/auth/services/authService';

// Attaches the token and always sends cookies
function withAuth(req: HttpRequest<unknown>, token: string | null) {
  return req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Shared "is a refresh currently happening" state.
// null = not refreshing. string = refreshing, will emit the new token when done.
let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);

  const isRefreshCall = req.url.includes('/refresh-token-web');
  const request = withAuth(req, authStore.getAccessToken());

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Not a 401, or it's the refresh call itself failing -> just fail
      if (error.status !== 401 || isRefreshCall) {
        return throwError(() => error);
      }

      // Case 1: no refresh in progress yet -> start one
      if (!isRefreshing) {
        isRefreshing = true;
        refreshedToken$.next(null); // reset so others know it's not ready yet

        return authService.refreshToken().pipe(
          switchMap((response) => {
            authStore.setAuth(response);
            isRefreshing = false;
            refreshedToken$.next(response.accessToken); // tell everyone waiting

            return next(withAuth(req, response.accessToken));
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authStore.clearAuth();
            return throwError(() => refreshError);
          }),
        );
      }

      // Case 2: a refresh is already in progress -> wait for it, then retry
      return refreshedToken$.pipe(
        filter((token): token is string => token !== null), // wait until it's ready
        take(1),
        switchMap((token) => next(withAuth(req, token))),
      );
    }),
  );
};
