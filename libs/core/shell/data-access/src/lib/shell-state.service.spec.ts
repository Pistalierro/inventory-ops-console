jest.mock('@inventory-ops-console/core-auth-data-access', () => ({
  AuthSessionService: class AuthSessionService {},
  AuthStateService: class AuthStateService {},
}));

jest.mock('@inventory-ops-console/core-user-data-access', () => ({
  UserProfileFirestoreService: class UserProfileFirestoreService {},
}));

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { AuthUser } from '@inventory-ops-console/core-auth-data-access';
import {
  AuthSessionService,
  AuthStateService,
} from '@inventory-ops-console/core-auth-data-access';
import { UserProfileFirestoreService } from '@inventory-ops-console/core-user-data-access';
import type { UserProfile } from '@inventory-ops-console/shared-models';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ShellStateService } from './shell-state.service';

describe('ShellStateService', () => {
  let service: ShellStateService;
  let authUser$: BehaviorSubject<AuthUser | null>;
  let authUser: ReturnType<typeof signal<AuthUser | null>>;
  let authSessionService: { signOut: jest.Mock };
  let authStateService: {
    authUser$: Observable<AuthUser | null>;
    authUser: ReturnType<typeof signal<AuthUser | null>>;
  };
  let userProfileFirestoreService: { getUserProfile: jest.Mock };
  let router: { navigateByUrl: jest.Mock };

  beforeEach(() => {
    window.localStorage.clear();

    authUser$ = new BehaviorSubject<AuthUser | null>(null);
    authUser = signal<AuthUser | null>(null);

    authSessionService = {
      signOut: jest.fn(),
    };

    authStateService = {
      authUser$: authUser$.asObservable(),
      authUser,
    };

    userProfileFirestoreService = {
      getUserProfile: jest.fn(),
    };

    router = {
      navigateByUrl: jest.fn(),
    };
  });

  function setupService(): void {
    TestBed.configureTestingModule({
      providers: [
        ShellStateService,
        { provide: AuthSessionService, useValue: authSessionService },
        { provide: AuthStateService, useValue: authStateService },
        {
          provide: UserProfileFirestoreService,
          useValue: userProfileFirestoreService,
        },
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(ShellStateService);
  }

  it('should expose fallback user summary when no auth user is available', () => {
    setupService();

    expect(service.profile()).toBeNull();
    expect(service.displayName()).toBe('Console user');
    expect(service.email()).toBe('');
    expect(service.roleLabel()).toBe('Viewer');
    expect(service.initials()).toBe('CU');
    expect(userProfileFirestoreService.getUserProfile).not.toHaveBeenCalled();
  });

  it('should read profile for current auth user and expose user summary', () => {
    setupService();

    const currentUser: AuthUser = {
      uid: 'user-1',
      email: 'auth@example.com',
      displayName: 'Auth Name',
    };
    const profile: UserProfile = {
      uid: 'user-1',
      email: 'profile@example.com',
      displayName: 'Ada Lovelace',
      role: 'manager',
    };

    userProfileFirestoreService.getUserProfile.mockReturnValue(of(profile));

    authUser.set(currentUser);
    authUser$.next(currentUser);

    expect(userProfileFirestoreService.getUserProfile).toHaveBeenCalledWith(
      'user-1'
    );
    expect(service.profile()).toEqual(profile);
    expect(service.displayName()).toBe('Ada Lovelace');
    expect(service.email()).toBe('profile@example.com');
    expect(service.roleLabel()).toBe('Manager');
    expect(service.initials()).toBe('AL');
  });

  it('should fall back to auth user summary when profile loading fails', () => {
    setupService();

    const currentUser: AuthUser = {
      uid: 'user-1',
      email: 'auth@example.com',
      displayName: 'Auth Name',
    };

    userProfileFirestoreService.getUserProfile.mockReturnValue(
      throwError(() => new Error('Profile read failed'))
    );

    authUser.set(currentUser);
    authUser$.next(currentUser);

    expect(service.profile()).toBeNull();
    expect(service.displayName()).toBe('Auth Name');
    expect(service.email()).toBe('auth@example.com');
    expect(service.roleLabel()).toBe('Viewer');
    expect(service.initials()).toBe('AN');
  });

  it('should create initials from email when display name is not available', () => {
    setupService();

    const currentUser: AuthUser = {
      uid: 'user-1',
      email: 'person@example.com',
      displayName: null,
    };

    userProfileFirestoreService.getUserProfile.mockReturnValue(
      throwError(() => new Error('Profile read failed'))
    );

    authUser.set(currentUser);
    authUser$.next(currentUser);

    expect(service.displayName()).toBe('person@example.com');
    expect(service.initials()).toBe('PE');
  });

  it('should toggle theme', () => {
    setupService();

    const initialTheme = service.theme();

    service.toggleTheme();

    expect(service.theme()).toBe(initialTheme === 'dark' ? 'light' : 'dark');
  });

  it('should read initial theme from local storage', () => {
    window.localStorage.setItem('ioc-theme', 'dark');

    setupService();

    expect(service.theme()).toBe('dark');
  });

  it('should persist theme when toggled', () => {
    setupService();

    service.toggleTheme();

    expect(window.localStorage.getItem('ioc-theme')).toBe(service.theme());
  });

  it('should sign out and navigate to login', async () => {
    setupService();

    authSessionService.signOut.mockResolvedValue(undefined);
    router.navigateByUrl.mockResolvedValue(true);

    await service.signOut();

    expect(authSessionService.signOut).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(service.isSigningOut()).toBe(false);
  });

  it('should reset signing out state when sign out fails', async () => {
    setupService();

    authSessionService.signOut.mockRejectedValue(new Error('Sign out failed'));

    await expect(service.signOut()).rejects.toThrow('Sign out failed');

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(service.isSigningOut()).toBe(false);
  });
});
