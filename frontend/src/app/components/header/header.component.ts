import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';

import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterComponent, LoginComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false; // Control del submenú
  isLoggedIn = false; // Estado del usuario logueado
  isRegisterModalOpen = false; // Estado del modal de registro
  isLoginModalOpen = false;

  constructor(public router: Router) {}

  ngOnInit() {
    // Verifica si localStorage está disponible antes de usarlo
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      this.isLoggedIn = !!localStorage.getItem('authToken');
    } else {
      this.isLoggedIn = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openRegisterModal() {
    this.menuOpen = false; // Cierra el submenú
    this.isRegisterModalOpen = true; // Abre el modal de registro
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout() {
    // Eliminar token y datos de usuario al cerrar sesión
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/']); // Redirigir al home
  }
}
