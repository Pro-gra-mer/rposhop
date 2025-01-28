import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.css'],
})
export class RequestPasswordComponent {
  @Output() close = new EventEmitter<void>(); // Emite evento para cerrar el modal
  requestPasswordForm: FormGroup;
  submitted = false;
  message: string | null = null; // Mensaje de éxito o error
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.requestPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = null;

    if (this.requestPasswordForm.invalid) {
      return;
    }

    console.log('Correo enviado:', this.requestPasswordForm.value.email); // Agregar este log

    this.isLoading = true;

    this.authService.requestPassword(this.requestPasswordForm.value).subscribe({
      next: () => {
        this.message =
          'Se ha enviado un enlace para restablecer tu contraseña a tu correo.';
        this.isLoading = false;
        setTimeout(() => this.close.emit(), 3000); // Cerrar modal después de 3 segundos
      },
      error: () => {
        this.message = 'No se encontró un usuario con ese correo.';
        this.isLoading = false;
      },
    });
  }
}
