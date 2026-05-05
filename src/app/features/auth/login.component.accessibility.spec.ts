import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('LoginComponent - Accesibilidad', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const userSignal = signal(null);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'lookupUser',
      'createUser',
      'setUser',
      'setToken',
    ]);
    mockAuthService.lookupUser.and.returnValue(Promise.resolve({ success: true, data: null, error: null }));
    mockAuthService.createUser.and.returnValue(Promise.resolve({ success: true, data: null, error: null }));
    Object.defineProperty(mockAuthService, 'user', { get: () => userSignal, configurable: true });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('ARIA Attributes en Formulario', () => {
    it('should have form with aria-label', () => {
      const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
      expect(form.getAttribute('aria-label')).toBe('Formulario de inicio de sesión');
    });

    it('should have email input with aria-required="true"', () => {
      fixture.detectChanges();
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput).toBeTruthy();
      expect(emailInput.getAttribute('aria-required')).toBe('true');
    });

    it('should have email input with aria-invalid when touched and invalid', () => {
      fixture.detectChanges();
      component.email.set('invalid-email');
      component.onEmailBlur();
      fixture.detectChanges();

      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not have aria-invalid when email is valid', () => {
      fixture.detectChanges();
      component.email.set('test@example.com');
      component.onEmailBlur();
      fixture.detectChanges();

      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput.getAttribute('aria-invalid')).toBe('false');
    });

    it('should have submit button with aria-busy when loading', () => {
      fixture.detectChanges();
      component.loading.set(true);
      fixture.detectChanges();

      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.getAttribute('aria-busy')).toBe('true');
    });

    it('should have submit button with aria-label', () => {
      fixture.detectChanges();
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have loading spinner with role="status"', () => {
      component.loading.set(true);
      fixture.detectChanges();

      const statusElement: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
      expect(statusElement).toBeTruthy();
    });
  });

  describe('ARIA Attributes en Dialog (Crear Cuenta)', () => {
    it('should have dialog with role="dialog" when shown', () => {
      component.showCreateDialog.set(true);
      fixture.detectChanges();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should have dialog with aria-modal="true"', () => {
      component.showCreateDialog.set(true);
      fixture.detectChanges();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should have dialog with aria-labelledby', () => {
      component.showCreateDialog.set(true);
      fixture.detectChanges();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      const labelledby = dialog.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();

      const title: HTMLElement = fixture.nativeElement.querySelector(`#${labelledby}`);
      expect(title).toBeTruthy();
    });

    it('should have dialog with action buttons', () => {
      component.showCreateDialog.set(true);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('ARIA en mensajes de error', () => {
    it('should have error div with role="alert"', () => {
      component.error.set('Error de prueba');
      fixture.detectChanges();

      const alertDiv: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
      expect(alertDiv).toBeTruthy();
    });

    it('should have error div with aria-live="polite"', () => {
      component.error.set('Error de prueba');
      fixture.detectChanges();

      const alertDiv: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
      expect(alertDiv.getAttribute('aria-live')).toBe('polite');
    });

    it('should have error div with id for aria-describedby', () => {
      component.error.set('Error de prueba');
      fixture.detectChanges();

      const alertDiv: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
      expect(alertDiv.id).toBeTruthy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have form elements accessible', () => {
      fixture.detectChanges();
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput).toBeTruthy();
    });

    it('should have submit button accessible', () => {
      fixture.detectChanges();
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn).toBeTruthy();
    });
  });

  describe('Autocomplete Attributes', () => {
    it('should have email input with autocomplete="email"', () => {
      fixture.detectChanges();
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
      expect(emailInput.getAttribute('autocomplete')).toBe('email');
    });
  });
});
