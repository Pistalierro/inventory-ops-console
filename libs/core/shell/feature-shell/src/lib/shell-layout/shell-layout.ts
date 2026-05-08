import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellSidebar } from '../shell-sidebar/shell-sidebar';
import { ShellTopbar } from '../shell-topbar/shell-topbar';

@Component({
  selector: 'ioc-shell-layout',
  imports: [RouterOutlet, ShellTopbar, ShellSidebar],
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLayout {}
