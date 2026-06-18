import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    // Mock localStorage
    vi.spyOn(localStorage, 'getItem').mockImplementation((key: string) => store[key] || null);
    vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });

    // Mock document.documentElement classList
    const classList = document.documentElement.classList;
    vi.spyOn(classList, 'add');
    vi.spyOn(classList, 'remove');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created and default to system preferences or light', () => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
    expect(service.selectedTheme()).toBeDefined();
  });

  it('should load theme from localStorage if present', () => {
    store['theme'] = 'dark';
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
    expect(service.selectedTheme()).toBe('dark');
  });

  it('should toggle theme and update localStorage and document.documentElement', () => {
    store['theme'] = 'light';
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);

    // Initial check
    expect(service.selectedTheme()).toBe('light');

    // Toggle to dark
    service.toggleTheme();
    expect(service.selectedTheme()).toBe('dark');
    expect(store['theme']).toBe('dark');

    // Toggle back to light
    service.toggleTheme();
    expect(service.selectedTheme()).toBe('light');
    expect(store['theme']).toBe('light');
  });

  it('should set custom theme directly', () => {
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');
    expect(service.selectedTheme()).toBe('dark');
    expect(store['theme']).toBe('dark');
  });
});
