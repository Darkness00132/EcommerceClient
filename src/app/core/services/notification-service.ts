import { inject, Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  private readonly defaultConfig: Partial<IndividualConfig> = {
    progressBar: true,
    closeButton: true,
    progressAnimation: 'increasing',
    tapToDismiss: true,
    easeTime: 300,
    timeOut: 5000,
  };

  success(message: string, title = 'Success'): void {
    this.toastr.success(message, title, this.defaultConfig);
  }

  error(message: string, title = 'Error'): void {
    this.toastr.error(message, title, this.defaultConfig);
  }

  warning(message: string, title = 'Warning'): void {
    this.toastr.warning(message, title, this.defaultConfig);
  }

  info(message: string, title = 'Information'): void {
    this.toastr.info(message, title, this.defaultConfig);
  }
}
