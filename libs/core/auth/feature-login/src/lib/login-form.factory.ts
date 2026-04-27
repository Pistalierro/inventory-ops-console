import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

export type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

export function createLoginForm(
  formBuilder: NonNullableFormBuilder
): LoginForm {
  return formBuilder.group({
    email: formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });
}
