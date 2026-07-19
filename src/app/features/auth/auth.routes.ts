import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ConfirmEmail } from './components/confirm-email/confirm-email';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

export const authRoutes: Routes = [
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'auth/register',
    component: Register,
  },
  {
    path: 'auth/confirm-email',
    component: ConfirmEmail,
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'auth/reset-password',
    component: ResetPassword,
  },
];
