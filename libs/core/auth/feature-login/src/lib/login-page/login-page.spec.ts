jest.mock('@inventory-ops-console/core-auth-data-access', () => ({
  AuthSessionService: class AuthSessionService {},
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthSessionService } from '@inventory-ops-console/core-auth-data-access';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let authSessionService: { signIn: jest.Mock };
  let router: { navigateByUrl: jest.Mock };

  beforeEach(async () => {
    authSessionService = {
      signIn: jest.fn(),
    };

    router = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthSessionService, useValue: authSessionService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  it('should not sign in when form is invalid', async () => {
    await submitLoginForm();

    expect(authSessionService.signIn).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should sign in and navigate to dashboard when form is valid', async () => {
    authSessionService.signIn.mockResolvedValue({});

    setInputValue('input[formControlName="email"]', 'user@company.com');
    setInputValue('input[formControlName="password"]', 'password123');

    await submitLoginForm();

    expect(authSessionService.signIn).toHaveBeenCalledWith(
      'user@company.com',
      'password123'
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
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

  async function submitLoginForm(): Promise<void> {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));

    fixture.detectChanges();
    await fixture.whenStable();
  }
});
