import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDarkMode = signal(false);
  isMobileMenuOpen = signal(false);

  constructor(public authService: AuthService) {}

  toggleDarkMode() {
    this.isDarkMode.update((v) => !v);
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  get initial(): string {
    const name = this.authService.currentUsername();
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
