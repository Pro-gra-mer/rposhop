import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { RequestPasswordComponent } from '../request-password/request-password.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isRegisterModalOpen = false;
  isLoginModalOpen = false;
  isRequestPasswordModalOpen = false;

  resetPasswordToken: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los estados de autenticación y rol
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
      })
    );

    this.subscriptions.add(
      this.authService.isAdmin$.subscribe((admin) => {
        this.isAdmin = admin;
      })
    );

    // Restaurar sesión al cargar el componente
    this.authService.restoreSession();
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.unsubscribe();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  openRegisterModal(): void {
    this.menuOpen = false;
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal(): void {
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

  logout(): void {
    // Delegar el logout al AuthService
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openRequestPasswordModal(): void {
    this.isLoginModalOpen = false;
    this.menuOpen = false;
    this.isRequestPasswordModalOpen = true;
  }

  closeRequestPasswordModal(): void {
    this.isRequestPasswordModalOpen = false;
  }

  openResetPasswordModal(token: string | null): void {
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

  closeResetPasswordModal(): void {
    this.resetPasswordToken = null;

    // Elimina los parámetros de la URL para evitar abrir el modal nuevamente
    this.router.navigate([], {
      queryParams: { token: null },
      queryParamsHandling: 'merge',
    });
  }
}
