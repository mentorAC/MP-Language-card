import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Title block every page opens with. Actions are projected in, so the header
 * itself knows nothing about the feature that uses it.
 */
@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
