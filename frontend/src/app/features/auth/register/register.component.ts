import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = signal(false);
  fieldErrors = signal<FieldErrors>({});
  loading = signal(false);
  successMessage = signal<string | null>(null);

  private nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRules = {
    minLength: 6,
    hasUpper: /[A-Z]/,
    hasLower: /[a-z]/,
    hasDigit: /[0-9]/
  };

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  validateUsername() {
    const errors = { ...this.fieldErrors() };
    if (!this.username.trim()) {
      errors.username = 'Please enter your name.';
    } else if (!this.nameRegex.test(this.username.trim())) {
      errors.username = 'Name can only contain letters.';
    } else {
      delete errors.username;
    }
    this.fieldErrors.set(errors);
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
      errors.password = 'Please enter a password.';
    } else if (this.password.length < this.passwordRules.minLength) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (!this.passwordRules.hasUpper.test(this.password)) {
      errors.password = 'Password must include at least one uppercase letter.';
    } else if (!this.passwordRules.hasLower.test(this.password)) {
      errors.password = 'Password must include at least one lowercase letter.';
    } else if (!this.passwordRules.hasDigit.test(this.password)) {
      errors.password = 'Password must include at least one number.';
    } else {
      delete errors.password;
    }
    this.fieldErrors.set(errors);

    // Re-check confirm password whenever password changes
    if (this.confirmPassword) {
      this.validateConfirmPassword();
    }
  }

  validateConfirmPassword() {
    const errors = { ...this.fieldErrors() };
    if (!this.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (this.password !== this.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    } else {
      delete errors.confirmPassword;
    }
    this.fieldErrors.set(errors);
  }

 onSubmit() {
  this.validateUsername();
  this.validateEmail();
  this.validatePassword();
  this.validateConfirmPassword();

  const errors = this.fieldErrors();
  const hasErrors = !!(errors.username || errors.email || errors.password || errors.confirmPassword);

  if (hasErrors) return;

  this.loading.set(true);

  this.authService
    .register({ username: this.username, email: this.email, password: this.password })
    .subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { email: this.email } });
        }, 1800);
      },
      error: (err) => {
        this.loading.set(false);
        this.fieldErrors.set({ ...this.fieldErrors(), ...this.parseBackendErrors(err.error) });
      }
    });
}

  private parseBackendErrors(errorBody: any): FieldErrors {
    const result: FieldErrors = {};

    if (errorBody?.errors) {
      for (const key of Object.keys(errorBody.errors)) {
        const message = errorBody.errors[key][0];
        const field = key.toLowerCase();
        if (field.includes('username')) result.username = message;
        else if (field.includes('email')) result.email = message;
        else if (field.includes('password')) result.password = message;
        else result.general = message;
      }
      return result;
    }

    if (Array.isArray(errorBody)) {
      for (const e of errorBody) {
        const message = this.friendlyMessage(e.code, e.description);
        if (e.code?.startsWith('Password')) {
          result.password = message;
        } else if (e.code?.includes('UserName') || e.code?.includes('Email')) {
          result.email = message;
        } else {
          result.general = message;
        }
      }
      return result;
    }

    if (errorBody?.message) {
      result.email = errorBody.message;
      return result;
    }

    result.general = 'Registration failed. Please try again.';
    return result;
  }

  private friendlyMessage(code: string, fallback: string): string {
    const messages: Record<string, string> = {
      PasswordTooShort: 'Password must be at least 6 characters.',
      PasswordRequiresDigit: 'Password must include at least one number.',
      PasswordRequiresLower: 'Password must include at least one lowercase letter.',
      PasswordRequiresUpper: 'Password must include at least one uppercase letter.',
      PasswordRequiresUniqueChars: 'Password must include more variety of characters.',
      DuplicateUserName: 'This email is already registered.',
      InvalidEmail: 'Please enter a valid email address.'
    };
    return messages[code] || fallback;
  }
}
