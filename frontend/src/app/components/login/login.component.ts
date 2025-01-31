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
    private router: Router
  ) {
    // Configurar el formulario reactivo
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], // Validación simple
    });
  }

  // Getter para facilitar el acceso a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    this.submitted = true;
    this.message = null; // Limpia mensajes anteriores

    if (this.loginForm.invalid) {
      return; // No continuar si el formulario es inválido
    }

    this.isLoading = true;

    // Llama al método `login` del servicio para hacer la solicitud HTTP
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        // Maneja el estado del usuario después del login exitoso
        this.authService.handleLogin(response); // Actualiza los estados isLoggedIn e isAdmin

        this.isSuccess = true;
        this.message = 'Inicio de sesión exitoso.';
        this.isLoading = false;

        // Redirige al home o donde sea necesario
        this.loginSuccess.emit();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;

        // Manejo del mensaje de error basado en el código de estado
        if (err.status === 401) {
          this.message =
            'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else if (err.status === 403) {
          this.message = 'Cuenta no activada. Por favor, revisa tu correo.';
        } else {
          this.message = 'Ocurrió un error inesperado. Inténtalo más tarde.';
        }
      },
    });
  }

  // Método para abrir el modal de "Recuperar Contraseña"
  openRequestPasswordModal(): void {
    this.openRequestPassword.emit(); // Notifica al componente padre
  }
}
