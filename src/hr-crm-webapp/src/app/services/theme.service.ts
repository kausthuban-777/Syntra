import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  applyTheme(isDark: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    const newDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newDarkMode);
    this.applyTheme(newDarkMode);
  }
}
