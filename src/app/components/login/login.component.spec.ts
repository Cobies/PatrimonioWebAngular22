import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when username is empty', () => {
    component.username = '';
    component.password = 'some-password';
    component.onSubmit();

    expect(component.errorMessage()).toBe('El usuario es requerido');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show error when password is empty', () => {
    component.username = 'some-user';
    component.password = '';
    component.onSubmit();

    expect(component.errorMessage()).toBe('La contraseña es requerida');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should redirect to home on successful login', () => {
    mockAuthService.login.mockReturnValue(true);

    component.username = 'admin';
    component.password = 'admin';
    component.onSubmit();

    expect(component.errorMessage()).toBeNull();
    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'admin');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show invalid credentials message on failed login', () => {
    mockAuthService.login.mockReturnValue(false);

    component.username = 'wrong';
    component.password = 'wrong';
    component.onSubmit();

    expect(component.errorMessage()).toBe('Usuario o contraseña inválidos');
    expect(mockAuthService.login).toHaveBeenCalledWith('wrong', 'wrong');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
