import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first, map } from 'rxjs/operators';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Espera hasta que loaded$ emita (ya terminó /me o cargó localStorage)
  return authService.loaded$.pipe(
    first(), // toma la primera emisión
    map(() => {
      if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
