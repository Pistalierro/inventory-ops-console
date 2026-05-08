import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShellStateService } from '@inventory-ops-console/core-shell-data-access';
import { UiButton } from '@inventory-ops-console/shared-ui/button';
import { UiInput } from '@inventory-ops-console/shared-ui/forms';
import { UiBadge } from '@inventory-ops-console/shared-ui/badge';

@Component({
  selector: 'ioc-shell-topbar',
  imports: [RouterLink, UiInput, UiButton, UiBadge],
  templateUrl: './shell-topbar.html',
  styleUrl: './shell-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellTopbar {
  protected readonly shellState = inject(ShellStateService);
}
