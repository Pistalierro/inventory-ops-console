import { DOCUMENT, inject, Injectable, signal } from '@angular/core';
import {
  AuthSessionService,
  AuthStateService,
} from '@inventory-ops-console/core-auth-data-access';
import { Router } from '@angular/router';
import { filter, firstValueFrom, take } from 'rxjs';

export type ShellTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ShellStateService {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly authStateService = inject(AuthStateService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  readonly isSigningOut = signal(false);
  readonly theme = signal<ShellTheme>(this.readInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';

    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
  }

  async signOut(): Promise<void> {
    this.isSigningOut.set(true);

    try {
      await this.authSessionService.signOut();
      await firstValueFrom(
        this.authStateService.authUser$.pipe(
          filter((user) => user === null),
          take(1)
        )
      );
      await this.router.navigateByUrl('/login');
    } finally {
      this.isSigningOut.set(false);
    }
  }

  private readInitialTheme(): ShellTheme {
    const theme = this.document.documentElement.getAttribute('data-theme');

    return theme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ShellTheme) {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
