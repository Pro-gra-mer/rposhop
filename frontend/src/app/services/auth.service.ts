import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  // BehaviorSubjects para manejar el estado de autenticación y el rol del usuario
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  // Registro
  register(registerData: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, registerData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        console.error('Error en el login:', error);
        let errorMessage = 'Ocurrió un error en el login.';

        // Manejo de errores basado en el código de estado
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

  // Manejo del login exitoso
  handleLogin(response: { token: string; role: string }): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('role', response.role);
    }

    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(response.role === 'ADMIN');
  }

  // Obtener el rol
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  // Restaurar sesión
  restoreSession(): void {
    // Verificar si estamos en un entorno de navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('role');

      // Actualizar los estados de autenticación y rol
      this.isLoggedInSubject.next(!!token);
      this.isAdminSubject.next(role === 'ADMIN');
    } else {
      // Si no estamos en un entorno de navegador, aseguramos que los estados sean falsos
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
