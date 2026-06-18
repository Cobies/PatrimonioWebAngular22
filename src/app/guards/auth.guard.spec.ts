import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: signal(false)
    };

    mockRouter = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  const runGuard = () => {
    return TestBed.runInInjectionContext(() => {
      const route = {} as ActivatedRouteSnapshot;
      const state = {} as RouterStateSnapshot;
      return authGuard(route, state);
    });
  };

  it('should allow navigation when user is authenticated', () => {
    mockAuthService.isAuthenticated.set(true);
    const result = runGuard();
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block navigation and redirect to /login when user is not authenticated', () => {
    mockAuthService.isAuthenticated.set(false);
    const result = runGuard();
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
