import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartMergeRequest } from '../../models/CartMergeRequest ';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  message: string | null = null;
  isSuccess = false;
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() openRequestPassword = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService // Inyecta CartService
  ) {
    // Configurar el formulario reactivo
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Getter para facilitar el acceso a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = null; // Limpia mensajes anteriores

    if (this.loginForm.invalid) {
      return; // No continuar si el formulario es inválido
    }

    this.isLoading = true;

    // Llama al método login del AuthService
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        // Maneja el login exitoso: guarda token, actualiza estados, etc.
        this.authService.handleLogin(response);

        // Fusiona el carrito anónimo (almacenado en localStorage) con el carrito persistente
        const anonCartJson = localStorage.getItem('anonymousCart');
        if (anonCartJson) {
          const mergeRequest: CartMergeRequest = JSON.parse(anonCartJson);
          this.cartService.mergeCart(mergeRequest).subscribe({
            next: (mergedCart) => {
              console.log('Carrito fusionado:', mergedCart);
              // Limpia el carrito anónimo del localStorage
              localStorage.removeItem('anonymousCart');
            },
            error: (error) => {
              console.error('Error al fusionar el carrito:', error);
            },
          });
        }

        this.isSuccess = true;
        this.message = 'Inicio de sesión exitoso.';
        this.isLoading = false;

        this.loginSuccess.emit();
        // Redirige a la página principal
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;

        if (err.status === 401) {
          this.message =
            'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (err.status === 403) {
          this.message = 'Cuenta no activada. Por favor, revisa tu correo.';
        } else {
          this.message = 'Ocurrió un error inesperado. Inténtalo más tarde.';
        }
      },
    });
  }

  openRequestPasswordModal(): void {
    this.openRequestPassword.emit();
  }
}
