import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-topbar.html',
  styleUrl: './app-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbar {}
