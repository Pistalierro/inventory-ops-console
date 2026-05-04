jest.mock('@inventory-ops-console/core-auth-data-access', () => ({
  AuthSessionService: class AuthSessionService {},
}));

jest.mock('@inventory-ops-console/core-user-data-access', () => ({
  UserProfileFirestoreService: class UserProfileFirestoreService {},
}));

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionService } from '@inventory-ops-console/core-auth-data-access';
import { UserProfileFirestoreService } from '@inventory-ops-console/core-user-data-access';
import { LoginPageState } from './login-page.state';

describe('LoginPageState', () => {
  let state: LoginPageState;
  let authSessionService: {
    signIn: jest.Mock;
    signUp: jest.Mock;
    sendPasswordReset: jest.Mock;
  };
  let userProfileFirestoreService: {
    createSelfProfile: jest.Mock;
  };
  let router: {
    navigateByUrl: jest.Mock;
  };

  beforeEach(() => {
    authSessionService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      sendPasswordReset: jest.fn(),
    };

    userProfileFirestoreService = {
      createSelfProfile: jest.fn(),
    };

    router = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LoginPageState,
        { provide: AuthSessionService, useValue: authSessionService },
        {
          provide: UserProfileFirestoreService,
          useValue: userProfileFirestoreService,
        },
        { provide: Router, useValue: router },
      ],
    });

    state = TestBed.inject(LoginPageState);
  });

  it('should be created', () => {
    expect(state).toBeTruthy();
  });

  it('should require display name only in register mode', () => {
    expect(state.form.controls.displayName.hasError('required')).toBe(false);

    state.switchMode('register');
    state.form.controls.displayName.markAsTouched();

    expect(state.isRegisterMode()).toBe(true);
    expect(state.form.controls.displayName.hasError('required')).toBe(true);
    expect(state.displayNameFieldState).toBe('error');
  });

  it('should sign in with remember me setting', async () => {
    authSessionService.signIn.mockResolvedValue({});
    router.navigateByUrl.mockResolvedValue(true);

    state.form.patchValue({
      email: 'user@company.com',
      password: 'password123',
      rememberMe: false,
    });

    await state.submit();

    expect(authSessionService.signIn).toHaveBeenCalledWith(
      'user@company.com',
      'password123',
      false
    );
    expect(authSessionService.signUp).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should create auth account and self profile in register mode', async () => {
    authSessionService.signUp.mockResolvedValue({
      user: { uid: 'user-1' },
    });
    userProfileFirestoreService.createSelfProfile.mockResolvedValue(undefined);
    router.navigateByUrl.mockResolvedValue(true);

    state.switchMode('register');
    state.form.patchValue({
      displayName: ' Test User ',
      email: 'user@company.com',
      password: 'password123',
    });

    await state.submit();

    expect(authSessionService.signUp).toHaveBeenCalledWith(
      'user@company.com',
      'password123'
    );
    expect(userProfileFirestoreService.createSelfProfile).toHaveBeenCalledWith({
      uid: 'user-1',
      email: 'user@company.com',
      displayName: 'Test User',
    });
    expect(authSessionService.signIn).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should send password reset email when email is valid', async () => {
    authSessionService.sendPasswordReset.mockResolvedValue(undefined);

    state.form.controls.email.setValue('user@company.com');

    await state.sendPasswordReset();

    expect(authSessionService.sendPasswordReset).toHaveBeenCalledWith(
      'user@company.com'
    );
    expect(state.submitSuccess()).toBe(
      'Password reset email sent. Check your inbox.'
    );
    expect(state.submitError()).toBeNull();
  });

  it('should not send password reset email when email is invalid', async () => {
    state.form.controls.email.setValue('invalid-email');

    await state.sendPasswordReset();

    expect(authSessionService.sendPasswordReset).not.toHaveBeenCalled();
    expect(state.showEmailFormatError).toBe(true);
  });
});
