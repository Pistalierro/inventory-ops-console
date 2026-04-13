import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'ioc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
