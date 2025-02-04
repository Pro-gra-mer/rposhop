import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../../models/Cart';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { LocalCartService } from '../../services/local-cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  errorMessage: string | null = null;
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private localCartService: LocalCartService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isAuthenticated = loggedIn;
      if (loggedIn) {
        this.loadCartFromBackend();
      } else {
        this.loadAnonymousCart();
      }
    });
  }

  private loadCartFromBackend(): void {
    this.cartService.refreshCart().subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  private loadAnonymousCart(): void {
    const anonCart = this.localCartService.getCart() || { items: [] };
    console.log('anonymousCart retrieved:', JSON.stringify(anonCart));
    this.cart = {
      id: 0,
      user: null,
      items: anonCart.items.map((item) => ({
        id: 0,
        product: {
          id: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          categoryId: 0,
          description: '',
        },
        quantity: item.quantity,
      })),
      total: anonCart.items.reduce(
        (acc, item) => acc + (item.price || 0) * item.quantity,
        0
      ),
    };
  }

  removeItem(productId: number): void {
    if (this.isAuthenticated) {
      this.cartService.removeCartItem(productId).subscribe({
        next: (cart) => (this.cart = cart),
        error: (err) => (this.errorMessage = err.message),
      });
    } else {
      this.localCartService.removeItem(productId);
      this.loadAnonymousCart();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    if (this.isAuthenticated) {
      this.cartService.updateCartItem(productId, quantity).subscribe({
        next: (cart) => (this.cart = cart),
        error: (err) => (this.errorMessage = err.message),
      });
    } else {
      this.localCartService.updateQuantity(productId, quantity);
      this.loadAnonymousCart();
    }
  }

  proceedToCheckout(): void {
    alert('Proceder al pago');
  }
}
