jest.mock('@inventory-ops-console/core-auth-data-access', () => ({
  AuthSessionService: class AuthSessionService {},
  mapAuthErrorMessage: jest.fn((_error, context) => {
    if (context === 'register') {
      return 'Unable to create account. Please try again.';
    }

    if (context === 'passwordReset') {
      return 'Unable to send password reset email. Please try again.';
    }

    return 'Unable to sign in. Please check your credentials.';
  }),
}));

jest.mock('@inventory-ops-console/core-user-data-access', () => ({
  UserProfileFirestoreService: class UserProfileFirestoreService {},
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionService } from '@inventory-ops-console/core-auth-data-access';
import { UserProfileFirestoreService } from '@inventory-ops-console/core-user-data-access';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let authSessionService: {
    signIn: jest.Mock;
    signUp: jest.Mock;
  };
  let userProfileFirestoreService: {
    createSelfProfile: jest.Mock;
  };
  let router: { navigateByUrl: jest.Mock };

  beforeEach(async () => {
    authSessionService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
    };

    userProfileFirestoreService = {
      createSelfProfile: jest.fn(),
    };

    router = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthSessionService, useValue: authSessionService },
        {
          provide: UserProfileFirestoreService,
          useValue: userProfileFirestoreService,
        },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  it('should not sign in when form is invalid', async () => {
    await submitLoginForm();

    expect(authSessionService.signIn).not.toHaveBeenCalled();
    expect(authSessionService.signUp).not.toHaveBeenCalled();
    expect(userProfileFirestoreService.createSelfProfile).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should sign in and navigate to dashboard when form is valid', async () => {
    authSessionService.signIn.mockResolvedValue({});

    setInputValue('input[formControlName="email"]', 'user@company.com');
    setInputValue('input[formControlName="password"]', 'password123');

    await submitLoginForm();

    expect(authSessionService.signIn).toHaveBeenCalledWith(
      'user@company.com',
      'password123',
      true
    );
    expect(authSessionService.signUp).not.toHaveBeenCalled();
    expect(userProfileFirestoreService.createSelfProfile).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should create account, profile, and navigate to dashboard in register mode', async () => {
    authSessionService.signUp.mockResolvedValue({
      user: { uid: 'user-1' },
    });
    userProfileFirestoreService.createSelfProfile.mockResolvedValue(undefined);

    clickButtonByText('Create account');

    setInputValue('input[formControlName="displayName"]', 'Test User');
    setInputValue('input[formControlName="email"]', 'user@company.com');
    setInputValue('input[formControlName="password"]', 'password123');

    await submitLoginForm();

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

  it('should show submit error when account creation fails', async () => {
    authSessionService.signUp.mockRejectedValue(
      new Error('Registration failed')
    );

    clickButtonByText('Create account');

    setInputValue('input[formControlName="displayName"]', 'Test User');
    setInputValue('input[formControlName="email"]', 'user@company.com');
    setInputValue('input[formControlName="password"]', 'password123');

    await submitLoginForm();

    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelector('.login-form__error')?.textContent
    ).toContain('Unable to create account. Please try again.');
  });

  it('should show submit error when sign in fails', async () => {
    authSessionService.signIn.mockRejectedValue(
      new Error('Invalid credentials')
    );

    setInputValue('input[formControlName="email"]', 'user@company.com');
    setInputValue('input[formControlName="password"]', 'password123');

    await submitLoginForm();

    fixture.detectChanges();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelector('.login-form__error')?.textContent
    ).toContain('Unable to sign in. Please check your credentials.');
  });

  function setInputValue(selector: string, value: string): void {
    const input = fixture.nativeElement.querySelector(
      selector
    ) as HTMLInputElement;

    input.value = value;
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  }

  function clickButtonByText(text: string): void {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ) as HTMLButtonElement[];

    const button = buttons.find((item) =>
      item.textContent?.trim().includes(text)
    );

    button?.click();
    fixture.detectChanges();
  }

  async function submitLoginForm(): Promise<void> {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));

    fixture.detectChanges();
    await fixture.whenStable();
  }
});
