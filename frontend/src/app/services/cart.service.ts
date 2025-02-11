import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Cart } from '../models/Cart';
import { CartMergeRequest } from '../models/CartMergeRequest ';
import { LocalCartService } from './local-cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://rposhop-backend-latest.onrender.com/api/cart';
  private cartSubject: BehaviorSubject<Cart | null> =
    new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localCartService: LocalCartService
  ) {
    this.refreshCart();
  }
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('authToken') || '';
      console.log('Token obtenido:', token);
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Carga inicial del carrito
  private loadCart(): void {
    this.http
      .get<Cart>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al obtener el carrito:', error);
          return throwError(() => new Error('No se pudo obtener el carrito.'));
        })
      )
      .subscribe((cart) => this.cartSubject.next(cart));
  }

  // Método para obtener el carrito como observable
  getCart(): Observable<Cart | null> {
    return this.cart$;
  }

  // Añadir producto y actualizar el BehaviorSubject
  addToCart(productId: number, quantity: number): Observable<Cart> {
    const url = `${this.apiUrl}/add?productId=${productId}&quantity=${quantity}`;
    return this.http.post<Cart>(url, {}, { headers: this.getHeaders() }).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.localCartService.setCartCount(total);
      }),
      catchError((error) => {
        console.error('Error al añadir producto al carrito', error);
        return throwError(
          () => new Error('No se pudo añadir el producto al carrito.')
        );
      })
    );
  }

  // Actualizar item y refrescar el BehaviorSubject
  updateCartItem(productId: number, quantity: number): Observable<Cart> {
    const url = `${this.apiUrl}/update?productId=${productId}&quantity=${quantity}`;
    return this.http.put<Cart>(url, {}, { headers: this.getHeaders() }).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.localCartService.setCartCount(total);
      }),
      catchError((error) => {
        console.error('Error al actualizar el carrito', error);
        return throwError(() => new Error('No se pudo actualizar el carrito.'));
      })
    );
  }

  // Eliminar item y actualizar el BehaviorSubject
  removeCartItem(productId: number): Observable<Cart> {
    const url = `${this.apiUrl}/remove?productId=${productId}`;
    return this.http.delete<Cart>(url, { headers: this.getHeaders() }).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.localCartService.setCartCount(total);
      }),
      catchError((error) => {
        console.error('Error al eliminar el producto del carrito', error);
        return throwError(
          () => new Error('No se pudo eliminar el producto del carrito.')
        );
      })
    );
  }

  // Fusionar carrito y actualizar el BehaviorSubject
  mergeCart(mergeRequest: CartMergeRequest): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/merge`, mergeRequest, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          const total = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          this.localCartService.setCartCount(total);
        }),
        catchError((error) => {
          console.error('Error al fusionar el carrito', error);
          return throwError(() => new Error('No se pudo fusionar el carrito.'));
        })
      );
  }

  refreshCart(): Observable<Cart> {
    return this.http
      .get<Cart>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          const total = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          this.localCartService.setCartCount(total);
        })
      );
  }
}
