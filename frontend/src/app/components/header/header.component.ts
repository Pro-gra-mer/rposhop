import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  loginModalOpen = false;
  forgotPasswordModalOpen = false;
  registerModalOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openLoginModal() {
    this.menuOpen = false;
    this.loginModalOpen = true;
  }

  closeLoginModal() {
    this.loginModalOpen = false;
  }

  openForgotPasswordModal() {
    this.loginModalOpen = false;
    this.forgotPasswordModalOpen = true;
  }

  closeForgotPasswordModal() {
    this.forgotPasswordModalOpen = false;
  }

  openRegisterModal() {
    this.menuOpen = false;
    this.registerModalOpen = true;
  }

  closeRegisterModal() {
    this.registerModalOpen = false;
  }
}
