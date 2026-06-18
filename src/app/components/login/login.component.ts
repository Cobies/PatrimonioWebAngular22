import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-radial from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 px-4 transition-colors duration-300">
      <div class="w-full max-w-md p-8 rounded-2xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl shadow-2xl transition-colors duration-300">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            PatrimonioWeb
          </h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to manage corporate assets
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6" novalidate>
          @if (errorMessage()) {
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50/50 dark:bg-red-900/20 dark:text-red-400 border border-red-200/50 dark:border-red-800/30" role="alert">
              {{ errorMessage() }}
            </div>
          }

          <div>
            <label for="username" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition duration-200"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-300/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';

  readonly errorMessage = signal<string | null>(null);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (!this.username.trim()) {
      this.errorMessage.set('Username is required');
      return;
    }

    if (!this.password) {
      this.errorMessage.set('Password is required');
      return;
    }

    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Invalid username or password');
    }
  }
}
