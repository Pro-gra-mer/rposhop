import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { CartService } from './cart.service';
import { Cart } from '../models/Cart';
import { LocalCartService } from './local-cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://rposhop-backend-latest.onrender.com/api/auth';

  // BehaviorSubjects para manejar el estado de autenticación y el rol del usuario
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private localCartService: LocalCartService
  ) {
    this.restoreSession();
  }

  // Registro
  register(registerData: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        console.error('Error en el login:', error);
        let errorMessage = 'Ocurrió un error en el login.';
        if (error.status === 401) {
          errorMessage =
            'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (error.status === 403) {
          errorMessage = 'Cuenta no activada. Por favor, revisa tu correo.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Decodifica el token JWT para obtener el usuario (email)
  getCurrentUser(): { email: string } {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token disponible');
    }
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(payload));
      // Se asume que el email está en el campo 'sub'
      return { email: decodedPayload.sub };
    } catch (e) {
      throw new Error('Error al decodificar el token');
    }
  }

  // Manejo del login exitoso y fusión del carrito anónimo
  handleLogin(response: { token: string; role: string }): void {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('role', response.role);
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(response.role === 'ADMIN');

    const anonCartJson = localStorage.getItem('anonymousCart');
    console.log('anonymousCart antes de la fusión:', anonCartJson);
    if (anonCartJson) {
      const mergeRequest = JSON.parse(anonCartJson);
      this.cartService.mergeCart(mergeRequest).subscribe({
        next: (mergedCart: Cart) => {
          console.log('Carrito fusionado:', mergedCart);
          // Se comenta la eliminación para mantener el carrito anónimo
          // localStorage.removeItem('anonymousCart');
          console.log('Carrito anónimo mantenido tras la fusión.');
        },
        error: (error: any) => {
          console.error('Error al fusionar el carrito:', error);
        },
      });
    }
  }

  // Obtener el rol
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    // No se elimina anonymousCart
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    console.log(
      'Logout realizado. anonymousCart:',
      localStorage.getItem('anonymousCart')
    );

    this.localCartService.setCartCount(0);

    window.location.href = '/'; // Fuerza la recarga completa de la página
  }

  // Restaurar sesión
  restoreSession(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('role');
      this.isLoggedInSubject.next(!!token);
      this.isAdminSubject.next(role === 'ADMIN');
    } else {
      this.isLoggedInSubject.next(false);
      this.isAdminSubject.next(false);
    }
  }

  // Recuperar contraseña
  requestPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password`, data);
  }

  // Resetear contraseña
  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  // Verificar si es administrador
  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
