import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SHELL_NAV_SECTIONS } from './shell-navigation.config';
import { UiBadge } from '@inventory-ops-console/shared-ui/badge';

@Component({
  selector: 'ioc-shell-sidebar',
  imports: [RouterLink, RouterLinkActive, UiBadge],
  templateUrl: './shell-sidebar.html',
  styleUrl: './shell-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellSidebar {
  protected readonly sections = SHELL_NAV_SECTIONS;
}
