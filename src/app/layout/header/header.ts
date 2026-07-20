import { Component } from '@angular/core';
import { LanguageButton } from '../language-button/language-button';
import { DarkmodeButton } from '../darkmode-button/darkmode-button';

@Component({
  selector: 'app-header',
  imports: [LanguageButton, DarkmodeButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
