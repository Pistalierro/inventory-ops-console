jest.mock('@inventory-ops-console/core-auth-data-access', () => ({
  AuthSessionService: class AuthSessionService {},
  AuthStateService: class AuthStateService {},
}));

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { AuthUser } from '@inventory-ops-console/core-auth-data-access';
import {
  AuthSessionService,
  AuthStateService,
} from '@inventory-ops-console/core-auth-data-access';
import { Observable, of } from 'rxjs';
import { ShellStateService } from './shell-state.service';

describe('ShellStateService', () => {
  let service: ShellStateService;
  let authSessionService: { signOut: jest.Mock };
  let authStateService: { authUser$: Observable<AuthUser | null> };
  let router: { navigateByUrl: jest.Mock };

  beforeEach(() => {
    authSessionService = {
      signOut: jest.fn(),
    };

    authStateService = {
      authUser$: of(null),
    };

    router = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ShellStateService,
        { provide: AuthSessionService, useValue: authSessionService },
        { provide: AuthStateService, useValue: authStateService },
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(ShellStateService);
  });

  it('should sign out and navigate to login', async () => {
    authSessionService.signOut.mockResolvedValue(undefined);
    router.navigateByUrl.mockResolvedValue(true);

    await service.signOut();

    expect(authSessionService.signOut).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(service.isSigningOut()).toBe(false);
  });

  it('should reset signing out state when sign out fails', async () => {
    authSessionService.signOut.mockRejectedValue(new Error('Sign out failed'));

    await expect(service.signOut()).rejects.toThrow('Sign out failed');

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(service.isSigningOut()).toBe(false);
  });
});
