import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type UiFormFieldState = 'default' | 'error';

@Component({
  selector: 'ioc-ui-form-field',
  imports: [],
  templateUrl: './ui-form-field.html',
  styleUrl: './ui-form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiFormField {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly state = input<UiFormFieldState>('default');
  readonly required = input(false);

  protected readonly hostClasses = computed(() => {
    return ['ui-form-field', `ui-form-field--${this.state()}`].join(' ');
  });
}
