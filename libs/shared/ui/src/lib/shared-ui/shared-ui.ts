import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-shared-ui',
  imports: [],
  templateUrl: './shared-ui.html',
  styleUrl: './shared-ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUi {}
