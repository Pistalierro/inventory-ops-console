import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import {
  AuthSessionService,
  AuthStateService,
} from '@inventory-ops-console/core-auth-data-access';
import { Router } from '@angular/router';
import {
  catchError,
  filter,
  firstValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { UserProfileFirestoreService } from '@inventory-ops-console/core-user-data-access';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserProfile, UserRole } from '@inventory-ops-console/shared-models';

export type ShellTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ShellStateService {
  private readonly themeStorageKey = 'ioc-theme';

  private readonly authSessionService = inject(AuthSessionService);
  private readonly authStateService = inject(AuthStateService);
  private readonly userProfileFirestoreService = inject(
    UserProfileFirestoreService
  );
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly profile$ = this.authStateService.authUser$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      }

      return this.userProfileFirestoreService.getUserProfile(user.uid).pipe(
        map((profile) => profile ?? null),
        catchError(() => of(null))
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly isSigningOut = signal(false);
  readonly theme = signal<ShellTheme>(this.readInitialTheme());
  readonly profile = toSignal<UserProfile | null>(this.profile$, {
    initialValue: null,
  });

  private readonly userSummarySource = computed<{
    displayName: string | null;
    email: string;
    role: UserRole;
  }>(() => {
    const profile = this.profile();
    const authUser = this.authStateService.authUser();

    return {
      displayName: profile?.displayName || authUser?.displayName || null,
      email: profile?.email || authUser?.email || '',
      role: profile?.role ?? 'viewer',
    };
  });

  readonly email = computed(() => this.userSummarySource().email);

  readonly displayName = computed(
    () => this.userSummarySource().displayName || this.email() || 'Console user'
  );

  readonly roleLabel = computed(() =>
    this.formatRole(this.userSummarySource().role)
  );

  readonly initials = computed(() => this.createInitials(this.displayName()));

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';

    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
    this.persistTheme(nextTheme);
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
    const storedTheme = this.document.defaultView?.localStorage.getItem(
      this.themeStorageKey
    );

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    const theme = this.document.documentElement.getAttribute('data-theme');

    return theme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ShellTheme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private formatRole(role: UserRole): string {
    const roleLabels: Record<UserRole, string> = {
      admin: 'Admin',
      manager: 'Manager',
      viewer: 'Viewer',
    };

    return roleLabels[role];
  }

  private createInitials(value: string): string {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return 'CU';
    }

    const parts = normalizedValue
      .replace(/@.*/, '')
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  private persistTheme(theme: ShellTheme): void {
    this.document.defaultView?.localStorage.setItem(
      this.themeStorageKey,
      theme
    );
  }
}
