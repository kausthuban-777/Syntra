import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSignal = signal(this.getStoredAuthState());

  isAuthenticated$ = this.isAuthenticatedSignal.asReadonly();

  constructor() {}

  /**
   * Get the stored authentication state from localStorage
   */
  private getStoredAuthState(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  /**
   * Login user - store authentication state
   */
  login(credentials: any): void {
    // TODO: Add actual authentication logic with backend
    // For now, we'll just set the authenticated state
    localStorage.setItem('isAuthenticated', 'true');
    // Store user data if needed
    if (credentials && credentials.email) {
      localStorage.setItem('userEmail', credentials.email);
    }
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Logout user - clear authentication state
   */
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  /**
   * Get current user email
   */
  getCurrentUserEmail(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userEmail');
    }
    return null;
  }
}
