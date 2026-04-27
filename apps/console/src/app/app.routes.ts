import { Route } from '@angular/router';
import {
  authRequiredGuard,
  guestOnlyGuard,
} from '@inventory-ops-console/core-auth-feature-access';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('@inventory-ops-console/core-auth-feature-login').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: '',
    canActivate: [authRequiredGuard],
    loadComponent: () =>
      import('@inventory-ops-console/core-shell-feature-shell').then(
        (m) => m.ShellLayout
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@inventory-ops-console/dashboard-feature-dashboard').then(
            (m) => m.DashboardPage
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
