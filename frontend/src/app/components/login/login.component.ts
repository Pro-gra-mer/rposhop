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
  isSuccess = false; // Nueva propiedad para diferenciar éxito de error
  @Output() closeMenu = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    this.submitted = true;
    this.message = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginSuccess.emit(); // Notifica al HeaderComponent

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.message = 'Inicio de sesión exitoso';
        this.isSuccess = true; // Marcar como éxito
        localStorage.setItem('authToken', response.token); // Guardar el token
        this.isLoading = false;

        // Cerrar el modal
        this.closeModal();
        this.closeMenu.emit(); // Emitir evento para cerrar el menú
        this.router.navigate(['/']); // Redirigir al home
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false; // Marcar como error
        if (err.error && typeof err.error === 'object') {
          this.message = err.error.message || 'Ocurrió un error.';
        } else {
          this.message = 'Error inesperado. Por favor, inténtalo nuevamente.';
        }
      },
    });
  }
  closeModal(): void {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.add('hidden'); // Esconde el modal
    }
  }
}
