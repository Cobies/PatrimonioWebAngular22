import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    // Mock localStorage
    vi.spyOn(localStorage, 'getItem').mockImplementation((key: string) => store[key] || null);
    vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    vi.spyOn(localStorage, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created and default to unauthenticated', () => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });

  it('should restore state from localStorage on startup', () => {
    const savedState = {
      isAuthenticated: true,
      token: 'saved-token'
    };
    store['auth_state'] = JSON.stringify(savedState);

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('saved-token');
  });

  it('should authenticate successfully with correct credentials', () => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);

    const result = service.login('admin', 'admin');
    expect(result).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).not.toBeNull();
    expect(store['auth_state']).toBeDefined();
  });

  it('should fail authentication with incorrect credentials', () => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);

    const result = service.login('wrong', 'credentials');
    expect(result).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });

  it('should log out and clear storage', () => {
    const savedState = {
      isAuthenticated: true,
      token: 'saved-token'
    };
    store['auth_state'] = JSON.stringify(savedState);

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBe(true);

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
    expect(store['auth_state']).toBeUndefined();
  });
});
