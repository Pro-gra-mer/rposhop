import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  message: string | null = null; // Mensaje de éxito o error
  isLoading = false; // Indicador de carga
  submitted = false; // Estado de envío del formulario
  @Input() token: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Si el token no viene desde el padre, intenta obtenerlo de la URL
    if (!this.token) {
      this.token = this.route.snapshot.queryParamMap.get('token');
      if (!this.token) {
        this.router.navigate(['/']);
      }
    }

    // Validar la existencia del token
    if (!this.token) {
      this.message = 'Token inválido o faltante.';
    }
  }

  // Helper getter for easy form access
  get f() {
    return this.resetPasswordForm.controls;
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return (
      (field?.invalid && (field.dirty || field.touched || this.submitted)) ??
      false
    );
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = null;

    // Validar formulario y token antes de enviar
    if (this.resetPasswordForm.invalid || !this.token) {
      this.message = 'Por favor, completa el formulario correctamente.';
      return;
    }

    this.isLoading = true;

    this.authService
      .resetPassword({
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword,
      })
      .subscribe({
        next: () => {
          this.message = 'Contraseña restablecida con éxito.';
          this.isLoading = true;
          setTimeout(() => {
            this.router.navigate(['/']); // Redirigir al login tras 3 segundos
          }, 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.message =
            err.error?.message || 'Error al restablecer la contraseña.';
        },
      });
  }
}
