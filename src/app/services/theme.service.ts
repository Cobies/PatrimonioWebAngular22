import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  readonly selectedTheme = signal<Theme>('light');

  constructor() {
    // Read initial theme from localStorage if in browser context
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.selectedTheme.set(savedTheme);
      } else {
        // Optional default to system theme preference, but fallback to 'light'
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.selectedTheme.set(prefersDark ? 'dark' : 'light');
      }
    }

    // Effect to toggle the class on document.documentElement (root)
    effect(() => {
      const theme = this.selectedTheme();
      this.applyTheme(theme);
    });
  }

  toggleTheme(): void {
    const nextTheme = this.selectedTheme() === 'light' ? 'dark' : 'light';
    this.selectedTheme.set(nextTheme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.THEME_KEY, nextTheme);
    }
  }

  setTheme(theme: Theme): void {
    this.selectedTheme.set(theme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}
