// src/app/security/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first, map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const required = route.data['role'] ?? route.data['roles'];

  return authService.loaded$.pipe(
    first(),
    map(() => {
      const user = authService.getUser();

      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      if (typeof required === 'string') {
        if (user.rol === required) return true;
        router.navigate(['/no-permission']);
        return false;
      }

      if (Array.isArray(required)) {
        if (required.includes(user.rol)) return true;
        router.navigate(['/no-permission']);
        return false;
      }

      return true;
    })
  );
};
