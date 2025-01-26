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
              '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
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

    if (this.registerForm.invalid) {
      return;
    }

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
      },
      error: (error) => {
        if (error.status === 400 && error.error.message) {
          this.message = 'Error en el registro: ' + error.error.message;
        } else {
          this.message =
            'Ocurrió un error inesperado. Por favor, inténtalo nuevamente.';
        }
      },
    });
  }
}
