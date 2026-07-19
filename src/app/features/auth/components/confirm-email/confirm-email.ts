import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-email',
  imports: [MatProgressSpinner],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  loading = signal(false);
  verified = signal(false);

  userId = '';
  token = '';

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  verifyEmail(): void {
    if (this.loading()) return;
    if (!this.userId || !this.token) {
      this.notification.error('The verification link is invalid.', 'Verification Failed');
      return;
    }

    this.loading.set(true);

    this.authService
      .confirmEmail(this.userId, this.token)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.verified.set(true);

          this.notification.success('Your email has been verified successfully.', 'Email Verified');
        },
        error: () => {
          this.notification.error(
            'The verification link is invalid or has expired.',
            'Verification Failed',
          );
        },
      });
  }
}
