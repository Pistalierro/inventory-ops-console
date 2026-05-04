import { computed, inject, Injectable, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthSessionService,
  mapAuthErrorMessage,
} from '@inventory-ops-console/core-auth-data-access';
import { UserProfileFirestoreService } from '@inventory-ops-console/core-user-data-access';
import { UiFormFieldState } from '@inventory-ops-console/shared-ui/forms';
import { createLoginForm } from '../login-form.factory';
import { AuthFormMode } from '../login-form.model';

@Injectable()
export class LoginPageState {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly userProfileFirestoreService = inject(
    UserProfileFirestoreService
  );
  private readonly router = inject(Router);

  readonly form = createLoginForm(this.formBuilder);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly mode = signal<AuthFormMode>('signIn');
  readonly submitSuccess = signal<string | null>(null);

  readonly isRegisterMode = computed(() => this.mode() === 'register');
  readonly submitLabel = computed(() =>
    this.isRegisterMode() ? 'Create account' : 'Sign in'
  );
  readonly submittingLabel = computed(() =>
    this.isRegisterMode() ? 'Creating account...' : 'Signing in...'
  );

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(null);

    const { displayName, email, password, rememberMe } =
      this.form.getRawValue();

    try {
      if (this.isRegisterMode()) {
        const credential = await this.authSessionService.signUp(
          email,
          password
        );

        await this.userProfileFirestoreService.createSelfProfile({
          uid: credential.user.uid,
          email,
          displayName: displayName.trim(),
        });
      } else {
        await this.authSessionService.signIn(email, password, rememberMe);
      }

      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.submitError.set(
        mapAuthErrorMessage(
          error,
          this.isRegisterMode() ? 'register' : 'signIn'
        )
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  switchMode(mode: AuthFormMode): void {
    if (this.mode() === mode) return;

    this.mode.set(mode);
    this.submitError.set(null);
    this.submitSuccess.set(null);

    const displayNameControl = this.form.controls.displayName;

    if (mode === 'register') {
      displayNameControl.setValidators([
        Validators.required,
        Validators.maxLength(120),
      ]);
    } else {
      displayNameControl.setValidators([Validators.maxLength(120)]);
      displayNameControl.reset('');
    }
    displayNameControl.updateValueAndValidity();
  }

  async sendPasswordReset(): Promise<void> {
    const emailControl = this.form.controls.email;

    emailControl.markAllAsTouched();
    emailControl.updateValueAndValidity();

    if (emailControl.invalid) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(null);

    try {
      await this.authSessionService.sendPasswordReset(emailControl.value);
      this.submitSuccess.set('Password reset email sent. Check your inbox.');
    } catch (error) {
      this.submitError.set(mapAuthErrorMessage(error, 'passwordReset'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  get showDisplayNameRequiredError(): boolean {
    const control = this.form.controls.displayName;

    return (
      this.isRegisterMode() && control.touched && control.hasError('required')
    );
  }

  get showDisplayNameMaxLengthError(): boolean {
    const control = this.form.controls.displayName;

    return (
      this.isRegisterMode() && control.touched && control.hasError('maxlength')
    );
  }

  get displayNameFieldState(): UiFormFieldState {
    return this.showDisplayNameRequiredError ||
      this.showDisplayNameMaxLengthError
      ? 'error'
      : 'default';
  }

  get showEmailRequiredError(): boolean {
    const control = this.form.controls.email;

    return control.touched && control.hasError('required');
  }

  get showEmailFormatError(): boolean {
    const control = this.form.controls.email;

    return control.touched && control.hasError('email');
  }

  get showPasswordRequiredError(): boolean {
    const control = this.form.controls.password;

    return control.touched && control.hasError('required');
  }

  get showPasswordMinLengthError(): boolean {
    const control = this.form.controls.password;

    return control.touched && control.hasError('minlength');
  }

  get emailFieldState(): UiFormFieldState {
    return this.showEmailRequiredError || this.showEmailFormatError
      ? 'error'
      : 'default';
  }

  get passwordFieldState(): UiFormFieldState {
    return this.showPasswordRequiredError || this.showPasswordMinLengthError
      ? 'error'
      : 'default';
  }
}
