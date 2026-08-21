import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; font-family: 'Inter', sans-serif;">
      <h1 style="font-family: 'Fraunces', serif;">Books</h1>
      <p>You're logged in as <strong>{{ authService.currentUsername() }}</strong></p>
      <button (click)="authService.logout()" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
        Logout
      </button>
    </div>
  `
})
export class BookListComponent {
  constructor(public authService: AuthService) {}
}
