import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Shown instead of an empty list, so a fresh page never looks broken. */
@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly text = input<string>('');
}
