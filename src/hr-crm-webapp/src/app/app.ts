import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { Layout } from './components/shared/layout/layout';
import { NavigationService } from './services/navigation.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('hr-crm-webapp');
  protected readonly authService = inject(AuthService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  constructor(public themeService: ThemeService) {
    // Theme service initialization happens in its constructor
  }

  ngOnInit() {
    // Update sidebar based on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlSegments = event.urlAfterRedirects.split('/').filter(s => s);
        const page = urlSegments[0] || 'home';
        this.navigationService.setCurrentPage(page);
      });
  }
}
