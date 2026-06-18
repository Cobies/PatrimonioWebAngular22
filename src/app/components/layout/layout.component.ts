import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
        <!-- Sidebar Navigation -->
        <app-sidebar></app-sidebar>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col h-full overflow-hidden">
          <!-- Navbar Header -->
          <app-navbar></app-navbar>

          <!-- Main Page Viewport -->
          <main class="flex-1 overflow-y-auto p-6 transition-colors duration-300">
            <ng-content></ng-content>
          </main>
        </div>
      </div>
    } @else {
      <!-- Plain view for login/anonymous routes -->
      <ng-content></ng-content>
    }
  `
})
export class LayoutComponent {
  readonly authService = inject(AuthService);
}
