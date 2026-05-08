import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UiButton } from '@inventory-ops-console/shared-ui/button';
import { ShellSidebar } from '../shell-sidebar/shell-sidebar';
import { ShellTopbar } from '../shell-topbar/shell-topbar';

@Component({
  selector: 'ioc-shell-layout',
  imports: [RouterOutlet, ShellTopbar, ShellSidebar, UiButton],
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLayout {
  private readonly document = inject(DOCUMENT);

  protected readonly isSidebarOpen = signal(false);

  protected toggleSidebar(): void {
    if (this.isSidebarOpen()) {
      this.closeSidebar();
      return;
    }

    this.isSidebarOpen.set(true);
  }

  protected closeSidebar(): void {
    this.blurActiveNavigationElement();
    this.isSidebarOpen.set(false);
  }

  private blurActiveNavigationElement(): void {
    const activeElement = this.document.activeElement;

    if (!(activeElement instanceof HTMLElement)) {
      return;
    }

    const isInsideDrawer = Boolean(
      activeElement.closest('.shell-layout__drawer')
    );
    const isBackdrop = activeElement.classList.contains('shell-layout__backdrop');

    if (isInsideDrawer || isBackdrop) {
      activeElement.blur();
    }
  }
}
