import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@inventory-ops-console/core-auth-feature-login').then(
        (m) => m.LoginPage
      ),
  },
];
