import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@inventory-ops-console/core-auth-data-access';
import { map, take } from 'rxjs';

export const guestOnlyGuard: CanActivateFn = () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  return authStateService.authUser$.pipe(
    take(1),
    map((user) => (user ? router.createUrlTree(['/dashboard']) : true))
  );
};
