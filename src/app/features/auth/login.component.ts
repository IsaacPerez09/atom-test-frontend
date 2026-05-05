import { Component, signal, computed, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { AuthService } from '../../core/services/auth.service';
import { User, AuthResponse } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, A11yModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  showCreateDialog = signal(false);
  touched = signal(false);

  readonly isValidEmail = computed(() => {
    const email = this.email();
    return email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  readonly emailHintId = computed(() => {
    const hasError = this.touched() && !this.isValidEmail() && this.email().length > 0;
    return hasError ? 'email-error' : 'email-hint';
  });

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showCreateDialog()) {
      this.onCancelCreate();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isValidEmail()) {
      this.error.set('Por favor, ingresa un correo electrónico válido');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.authService.lookupUser(this.email());

      if (!result.success && result.error) {
        this.error.set(result.error.message);
        this.loading.set(false);
        return;
      }

      const exists = (result.meta?.['exists'] as boolean | undefined) ?? false;
      const data = result.data;

      if (exists && data) {
        this.authService.setUser(data.user);
        this.authService.setToken(data.token);
        this.router.navigate(['/tasks']);
      } else {
        this.showCreateDialog.set(true);
      }
    } catch (err) {
      this.error.set('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  async onCreateUser(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.authService.createUser(this.email());

      if (!result.success && result.error) {
        this.error.set(result.error.message);
        this.loading.set(false);
        return;
      }

      const data = result.data;
      if (data) {
        this.authService.setUser(data.user);
        this.authService.setToken(data.token);
        this.router.navigate(['/tasks']);
      }
    } catch (err) {
      this.error.set('Error al crear el usuario. Por favor, inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  onCancelCreate(): void {
    this.showCreateDialog.set(false);
    this.email.set('');
  }

  onEmailBlur(): void {
    this.touched.set(true);
  }
}