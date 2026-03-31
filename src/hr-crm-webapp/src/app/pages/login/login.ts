import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If user is already authenticated, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.isLoading = true;

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    // TODO: Implement actual backend authentication
    // For now, we'll accept any non-empty credentials
    try {
      this.authService.login({ email: this.email });
      this.router.navigate(['/home']);
    } catch (error) {
      this.errorMessage = 'Login failed. Please try again.';
      this.isLoading = false;
    }
  }
}
