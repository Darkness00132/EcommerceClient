import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../services/token';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = inject(Token);
  const router = inject(Router);

  if (token.hasRole('Admin')) return true;

  return router.createUrlTree(['/auth/login']);
};
