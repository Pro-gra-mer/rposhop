import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { RequestPasswordComponent } from '../request-password/request-password.component';
import { AuthService } from '../../services/auth.service';
import { LocalCartService } from '../../services/local-cart.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegisterComponent,
    LoginComponent,
    RequestPasswordComponent,
    RouterLink,
    SearchBarComponent,
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
  cartCount = 0;
  resetPasswordToken: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localCartService: LocalCartService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
        // Si está autenticado, suscribirse al carrito del backend
        if (this.isLoggedIn) {
          this.cartService.refreshCart().subscribe();
          this.subscriptions.add(
            this.cartService.cart$.subscribe((cart) => {
              if (cart) {
                this.cartCount = cart.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
              }
            })
          );
        } else {
          // Si es anónimo, suscribirse al carrito local
          this.subscriptions.add(
            this.localCartService.cartCount$.subscribe((count) => {
              this.cartCount = count;
            })
          );
        }
      })
    );

    this.authService.restoreSession();
  }

  ngOnDestroy(): void {
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
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
    this.isRequestPasswordModalOpen = false;
  }

  closeResetPasswordModal(): void {
    this.resetPasswordToken = null;
    this.router.navigate([], {
      queryParams: { token: null },
      queryParamsHandling: 'merge',
    });
  }
}
