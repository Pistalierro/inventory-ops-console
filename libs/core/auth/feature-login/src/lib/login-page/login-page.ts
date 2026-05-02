import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createLoginForm } from '../login-form.factory';
import { AuthSessionService } from '@inventory-ops-console/core-auth-data-access';
import { UiButton } from '@inventory-ops-console/shared-ui/button';
import {
  UiFormField,
  UiFormFieldState,
  UiInput,
} from '@inventory-ops-console/shared-ui/forms';

@Component({
  selector: 'ioc-login-page',
  imports: [ReactiveFormsModule, UiButton, UiFormField, UiInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authSessionService = inject(AuthSessionService);
  private readonly router = inject(Router);

  protected readonly loginForm = createLoginForm(this.formBuilder);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authSessionService.signIn(email, password);
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.submitError.set('Unable to sign in. Please check your credentials.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected get showEmailRequiredError(): boolean {
    const control = this.loginForm.controls.email;

    return control.touched && control.hasError('required');
  }

  protected get showEmailFormatError(): boolean {
    const control = this.loginForm.controls.email;

    return control.touched && control.hasError('email');
  }

  protected get showPasswordRequiredError(): boolean {
    const control = this.loginForm.controls.password;

    return control.touched && control.hasError('required');
  }

  protected get showPasswordMinLengthError(): boolean {
    const control = this.loginForm.controls.password;

    return control.touched && control.hasError('minlength');
  }

  protected get emailFieldState(): UiFormFieldState {
    return this.showEmailRequiredError || this.showEmailFormatError
      ? 'error'
      : 'default';
  }

  protected get passwordFieldState(): UiFormFieldState {
    return this.showPasswordRequiredError || this.showPasswordMinLengthError
      ? 'error'
      : 'default';
  }
}
