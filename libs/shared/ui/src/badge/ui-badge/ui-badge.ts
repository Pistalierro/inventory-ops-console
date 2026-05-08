import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type UiBadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';

export type UiBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ioc-ui-badge',
  imports: [],
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class UiBadge {
  readonly variant = input<UiBadgeVariant>('neutral');
  readonly size = input<UiBadgeSize>('md');

  protected readonly hostClasses = computed(() => {
    return [
      'ui-badge',
      `ui-badge--${this.variant()}`,
      `ui-badge--${this.size()}`,
    ].join(' ');
  });
}
