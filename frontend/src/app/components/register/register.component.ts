import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  message: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Helper getter for easy form access
  get f() {
    return this.registerForm.controls;
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return (
      (field?.invalid && (field.dirty || field.touched || this.submitted)) ??
      false
    );
  }

  // Validador personalizado para contraseñas coincidentes
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    this.submitted = true;
    this.message = null;
    // Limpieza de errores previos
    this.registerForm.get('email')?.setErrors(null);

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    const registerData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.message =
          'Registro exitoso. Te hemos enviado un enlace de confirmación a tu correo. Por favor, verifica tu cuenta.';
        this.registerForm.reset();
        this.submitted = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        if (
          error.error?.message?.includes(
            'El correo electrónico ya está registrado'
          )
        ) {
          const emailControl = this.registerForm.get('email');
          emailControl?.setErrors({ emailExists: true });
        } else {
          this.message = error.error?.message || 'Error desconocido.';
        }
      },
    });
  }
}
