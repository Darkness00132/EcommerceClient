import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/authService';
import { NotificationService } from '../../../../core/services/notification-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private token = '';
  private email = '';

  hidePassword = signal(true);
  loading = signal(false);

  newPassword = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  onSubmit(): void {
    if (this.loading()) return;

    if (!this.token || !this.email) {
      this.notification.error(
        'The password reset link is invalid or has expired.',
        'Reset Password',
      );
      return;
    }

    if (this.newPassword.invalid) {
      this.newPassword.markAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService
      .resetPassword({
        token: this.token,
        email: this.email,
        newPassword: this.newPassword.getRawValue(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(
            'Your password has been reset successfully.',
            'Password Updated',
          );

          this.router.navigate(['/auth/login']);
        },
      });
  }
}
