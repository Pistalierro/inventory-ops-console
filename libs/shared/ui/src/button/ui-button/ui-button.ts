import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost';
export type UiButtonSize = 'lg' | 'md' | 'sm';
export type UiButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ioc-ui-button',
  imports: [],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiButton {
  readonly variant = input<UiButtonVariant>('primary');
  readonly size = input<UiButtonSize>('md');
  readonly type = input<UiButtonType>('button');
  readonly disabled = input(false);

  protected readonly hostClasses = computed(() => {
    return [
      'ui-button',
      `ui-button--${this.variant()}`,
      `ui-button--${this.size()}`,
    ].join(' ');
  });
}
