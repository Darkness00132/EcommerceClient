import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-language-button',
  imports: [MatIcon],
  templateUrl: './language-button.html',
  styleUrl: './language-button.css',
})
export class LanguageButton {
  private readonly transloco = inject(TranslocoService);

  switchLang(lang: 'en' | 'ar') {
    this.transloco.setActiveLang(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  get currentLang(): string {
    return this.transloco.getActiveLang();
  }
}
