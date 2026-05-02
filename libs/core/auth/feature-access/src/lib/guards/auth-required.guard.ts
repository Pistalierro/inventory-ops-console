import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@inventory-ops-console/core-auth-data-access';
import { map, take } from 'rxjs';

export const authRequiredGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (authStateService.currentAuthUser()) {
    return true;
  }

  return authStateService.authUser$.pipe(
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login'])))
  );
};
