import { Component, inject, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors duration-300">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <span>PatrimonioWeb</span>
        <span class="text-slate-300 dark:text-slate-600">/</span>
        <span class="text-slate-800 dark:text-white capitalize font-semibold">
          {{ activeRoute() }}
        </span>
      </div>

      <!-- Actions (Theme Toggle & Profile/Logout) -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle Button -->
        <button
          (click)="toggleTheme()"
          type="button"
          class="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden transition-colors duration-200 cursor-pointer"
          title="Toggle color theme"
        >
          @if (themeService.selectedTheme() === 'dark') {
            <!-- Sun Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21M9.75 9.75l1.5 1.5m4.5 4.5l1.5 1.5M21 12h-2.25M6 12H3.75m9.75-9.75l-1.5 1.5m-4.5 4.5l-1.5 1.5m1.5-1.5a6 6 0 1 1 8.486 8.486L12 12z" />
            </svg>
          } @else {
            <!-- Moon Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
            </svg>
          }
        </button>

        <!-- Divider -->
        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        <!-- Profile & Logout Group -->
        <div class="flex items-center gap-3">
          <div class="flex flex-col text-right">
            <span class="text-sm font-semibold text-slate-800 dark:text-white">Admin User</span>
            <span class="text-xs text-slate-400 dark:text-slate-500">Administrator</span>
          </div>
          <!-- Avatar Placeholder -->
          <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800">
            AD
          </div>
          <!-- Logout Button -->
          <button
            (click)="logout()"
            type="button"
            class="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 focus:outline-hidden transition-colors duration-200 cursor-pointer"
            title="Log out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Derive the active route name from router events using signals
  private readonly navEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null)
  );
  private readonly currentUrlSignal = toSignal(this.navEnd$);

  readonly activeRoute = computed(() => {
    const url = this.router.url;
    if (!url || url === '/' || url === '/dashboard') {
      return 'dashboard';
    }
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    return segments[segments.length - 1] || 'dashboard';
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
