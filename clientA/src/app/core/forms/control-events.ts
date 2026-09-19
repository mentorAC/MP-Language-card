import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';

/**
 * A signal that ticks whenever anything about `control` changes — its value,
 * validity, touched or pristine state.
 *
 * The app runs zoneless, so a template is only re-rendered for signals it has
 * read, while a reactive form reports through RxJS. Read this signal in any
 * computed that then looks at `control.valid`, `control.touched`, ... and the
 * two stay in step. Call it from an injection context (a field initializer).
 */
export function controlEvents(control: AbstractControl): Signal<unknown> {
  return toSignal(control.events, { initialValue: null });
}
