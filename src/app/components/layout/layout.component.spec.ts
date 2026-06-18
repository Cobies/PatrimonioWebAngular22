import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, SidebarComponent, NavbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT render sidebar and navbar when user is NOT authenticated', () => {
    mockAuthService.isAuthenticated.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeNull();
    expect(compiled.querySelector('app-navbar')).toBeNull();
  });

  it('should render sidebar and navbar when user is authenticated', () => {
    mockAuthService.isAuthenticated.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
  });
});
