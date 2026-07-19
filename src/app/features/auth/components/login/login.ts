import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/authService';
import { LoginRequest } from '../../models/login-request';
import { AuthStore } from '../../../../core/store/authStore';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  loading = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit(): void {
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: LoginRequest = this.form.getRawValue();

    this.loading.set(true);

    this.authService
      .login(data)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.authStore.setAuth(response);

          this.notification.success(`Welcome back!`, 'Login Successful');

          this.router.navigate(['/']);
        },
        error: () => {
          this.notification.error('Invalid email or password.', 'Login Failed');
        },
      });
  }
}
