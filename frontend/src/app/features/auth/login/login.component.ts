 import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  fieldErrors = signal<FieldErrors>({});
  loading = signal(false);

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Pre-fill email if redirected here from a successful registration
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    if (emailFromQuery) {
      this.email = emailFromQuery;
    }
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  validateEmail() {
    const errors = { ...this.fieldErrors() };
    if (!this.email.trim()) {
      errors.email = 'Please enter your email.';
    } else if (!this.emailRegex.test(this.email)) {
      errors.email = 'Please enter a valid email address.';
    } else {
      delete errors.email;
    }
    this.fieldErrors.set(errors);
  }

  validatePassword() {
    const errors = { ...this.fieldErrors() };
    if (!this.password) {
      errors.password = 'Please enter your password.';
    } else {
      delete errors.password;
    }
    this.fieldErrors.set(errors);
  }

  onSubmit() {
    this.validateEmail();
    this.validatePassword();

    const errors = this.fieldErrors();
    const hasErrors = !!(errors.email || errors.password);

    if (hasErrors) return;

    this.loading.set(true);
    this.fieldErrors.set({});

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.loading.set(false);
        this.fieldErrors.set(this.parseBackendErrors(err.error));
      }
    });
  }

  private parseBackendErrors(errorBody: any): FieldErrors {
    if (errorBody?.message) {
      // Backend intentionally returns a generic "Invalid email or password"
      // for both wrong email and wrong password, so we don't reveal which one is wrong.
      return { general: errorBody.message };
    }
    return { general: 'Invalid email or password.' };
  }
}
