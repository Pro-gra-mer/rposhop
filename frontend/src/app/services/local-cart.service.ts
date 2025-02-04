import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartMergeRequest } from '../models/CartMergeRequest ';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private storageKey = 'anonymousCart';
  private cartCountSubject: BehaviorSubject<number>;
  cartCount$;

  constructor() {
    const initialCart = this.getCart(); // Asegurar que tenemos un carrito antes de inicializar el BehaviorSubject
    const initialCount = initialCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.cartCountSubject = new BehaviorSubject<number>(initialCount);
    this.cartCount$ = this.cartCountSubject.asObservable();
  }

  private updateCartCount(cart: CartMergeRequest): void {
    const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(total);
  }

  getCart(): CartMergeRequest {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cartJson = localStorage.getItem(this.storageKey);
      const cart = cartJson ? JSON.parse(cartJson) : { items: [] };
      return cart;
    }
    return { items: [] };
  }

  saveCart(cart: CartMergeRequest): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartCount(cart);
        console.log(
          'Cart saved in localStorage:',
          localStorage.getItem(this.storageKey)
        );
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }

  addItem(
    productId: number,
    quantity: number,
    name: string,
    price: number,
    imageUrl: string
  ): void {
    let cart: CartMergeRequest = this.getCart();
    const existing = cart.items.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, name, price, imageUrl });
    }
    this.saveCart(cart);
    console.log('Carrito anónimo actualizado:', cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    let cart: CartMergeRequest = this.getCart();
    const item = cart.items.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    this.saveCart(cart);
  }

  removeItem(productId: number): void {
    let cart: CartMergeRequest = this.getCart();
    cart.items = cart.items.filter((item) => item.productId !== productId);
    this.saveCart(cart);
    console.log('Producto removido, carrito anónimo actualizado:', cart);
  }

  clearCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.storageKey);
      if (this.cartCountSubject) {
        this.cartCountSubject.next(0);
      }
    }
  }

  setCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }
}
