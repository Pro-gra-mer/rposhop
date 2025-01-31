import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn && authService.getRole() === 'ADMIN') {
        return true; // Permitir acceso
      }
      router.navigate(['/login']); // Redirigir al login si no tiene acceso
      return false;
    })
  );
};
