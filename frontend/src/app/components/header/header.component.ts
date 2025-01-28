import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { RequestPasswordComponent } from '../request-password/request-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegisterComponent,
    LoginComponent,
    RequestPasswordComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  isLoggedIn = false;
  isRegisterModalOpen = false;
  isLoginModalOpen = false;
  isRequestPasswordModalOpen = false;

  resetPasswordToken: string | null = null;

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check login status
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.isLoggedIn = true;
    }

    // Subscribe to query params changes
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.resetPasswordToken = token;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openRegisterModal() {
    this.menuOpen = false;
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  openLoginModal(): void {
    this.menuOpen = false;
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  openRequestPasswordModal() {
    this.isLoginModalOpen = false;
    this.menuOpen = false;
    this.isRequestPasswordModalOpen = true;
  }

  closeRequestPasswordModal() {
    this.isRequestPasswordModalOpen = false;
  }

  openResetPasswordModal(token: string | null) {
    if (!token) {
      console.error('No token provided for password reset');
      return;
    }

    console.log('Opening reset password modal with token:', token);
    this.resetPasswordToken = token;

    // Close other modals if they're open
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
    this.isRequestPasswordModalOpen = false;
  }

  closeResetPasswordModal() {
    this.resetPasswordToken = null;

    // Elimina los parámetros de la URL para evitar abrir el modal nuevamente
    this.router.navigate([], {
      queryParams: { token: null },
      queryParamsHandling: 'merge',
    });
  }
}
