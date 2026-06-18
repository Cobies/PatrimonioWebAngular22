import { Injectable, signal, computed } from '@angular/core';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_state';

  // State signal holding the current state
  private readonly state = signal<AuthState>({
    isAuthenticated: false,
    token: null
  });

  // Expose computed read-only signals
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly token = computed(() => this.state().token);

  constructor() {
    // Restore authentication state from localStorage if in browser context
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedState = localStorage.getItem(this.AUTH_KEY);
        if (savedState) {
          const parsed = JSON.parse(savedState) as AuthState;
          if (parsed && typeof parsed.isAuthenticated === 'boolean') {
            this.state.set(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to parse auth state from localStorage', e);
        this.logout();
      }
    }
  }

  /**
   * Log in with mock credentials: admin / admin
   * Returns true if successful, false otherwise.
   */
  login(username: string, password: string): boolean {
    if (username.trim() === 'admin' && password === 'admin') {
      const newState: AuthState = {
        isAuthenticated: true,
        token: 'mock-jwt-token-for-admin-' + Math.random().toString(36).substring(2)
      };
      this.state.set(newState);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(newState));
      }
      return true;
    }
    return false;
  }

  /**
   * Log out and clear state
   */
  logout(): void {
    const clearedState: AuthState = {
      isAuthenticated: false,
      token: null
    };
    this.state.set(clearedState);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.AUTH_KEY);
    }
  }
}
