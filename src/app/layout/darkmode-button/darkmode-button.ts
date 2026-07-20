import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-darkmode-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './darkmode-button.html',
  styleUrl: './darkmode-button.css',
})
export class DarkmodeButton {
  isDark = signal(this.getInitialTheme());

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  }

  constructor() {
    const dark = this.isDark();
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  }

  toggleTheme() {
    const next = !this.isDark();
    this.isDark.set(next);

    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);

    localStorage.setItem('theme', next ? 'dark' : 'light');
  }
}
