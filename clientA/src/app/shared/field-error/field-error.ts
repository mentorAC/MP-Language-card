import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { switchMap } from 'rxjs';

/**
 * The first validation message of a control, shown once the user has had a
 * chance to fill it in — after a blur, or after a submit the parent rejected.
 */
@Component({
  selector: 'app-field-error',
  imports: [],
  template: `
    @if (message()) {
      <p class="field-error">{{ message() }}</p>
    }
  `,
  styleUrl: './field-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldError {
  readonly control = input.required<AbstractControl>();
  /** Names the field in the message: "Word is required." */
  readonly label = input<string>('This field');
  /** Set by the form once submit was attempted, so untouched fields speak up too. */
  readonly submitted = input(false);

  // Re-runs `message` whenever the control reports a change; see controlEvents.
  private readonly events = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events)),
    { initialValue: null },
  );

  readonly message = computed(() => {
    this.events();

    const control = this.control();
    if (control.valid || !(control.touched || this.submitted())) {
      return '';
    }

    const errors = control.errors ?? {};
    if (errors['required']) {
      return `${this.label()} is required.`;
    }
    if (errors['maxlength']) {
      return `${this.label()} may be at most ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['minlength']) {
      return `${this.label()} must be at least ${errors['minlength'].requiredLength} characters.`;
    }

    return `${this.label()} is not valid.`;
  });
}
