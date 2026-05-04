import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiButton } from '@inventory-ops-console/shared-ui/button';
import { UiFormField, UiInput } from '@inventory-ops-console/shared-ui/forms';
import { LoginPageState } from './login-page.state';

@Component({
  selector: 'ioc-login-page',
  imports: [ReactiveFormsModule, UiButton, UiFormField, UiInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginPageState],
})
export class LoginPage {
  protected readonly state = inject(LoginPageState);
}
