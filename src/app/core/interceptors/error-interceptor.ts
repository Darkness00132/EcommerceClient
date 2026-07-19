import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ProblemDetails } from '../models/problem-details';
import { NotificationService } from '../services/notification-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Network/server unreachable
      if (error.status === 0) {
        notification.error('Unable to connect to the server.');
        return throwError(() => error);
      }

      const problem = error.error as ProblemDetails;

      notification.error(problem?.detail ?? 'An unexpected error occurred.');

      return throwError(() => error);
    }),
  );
};
