import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

export type LoginForm = FormGroup<{
  displayName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}>;

export function createLoginForm(
  formBuilder: NonNullableFormBuilder
): LoginForm {
  return formBuilder.group({
    displayName: formBuilder.control('', {
      validators: [Validators.maxLength(120)],
    }),
    email: formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
    rememberMe: formBuilder.control(true),
  });
}
