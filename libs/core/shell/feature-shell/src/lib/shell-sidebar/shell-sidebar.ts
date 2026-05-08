import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ioc-shell-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell-sidebar.html',
  styleUrl: './shell-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellSidebar {}
