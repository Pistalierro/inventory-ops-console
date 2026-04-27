import { Directive, input } from '@angular/core';

export type UiInputState = 'default' | 'error';

@Directive({
  selector: 'input[iocUiInput], textarea[iocUiInput]',
  standalone: true,
  host: {
    class: 'ui-input',
    '[class.ui-input--error]': "state() === 'error'",
    '[attr.aria-invalid]': "state() === 'error' ? 'true' : null",
  },
})
export class UiInput {
  readonly state = input<UiInputState>('default');
}
