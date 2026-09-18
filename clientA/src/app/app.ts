import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppTopbar } from './layout/app-topbar/app-topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppTopbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
