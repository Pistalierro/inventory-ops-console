import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ioc-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
