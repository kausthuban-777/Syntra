import { Component, AfterViewInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  router = inject(Router);
  navigationService = inject(NavigationService);
  private platformId = inject(PLATFORM_ID);
  activeLink = signal('home');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Extract the main route segment (first path component)
      const urlSegments = event.url.split('/').filter((segment: string) => segment && segment !== '?');
      const mainRoute = urlSegments[0] || 'home';

      // Update navbar active state
      this.activeLink.set(mainRoute);

      // Update sidebar based on main route
      this.navigationService.setCurrentPage(mainRoute);
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupThemeToggle();
    }
  }

  private setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.themeService.toggleTheme());
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
