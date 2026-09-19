import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { controlEvents } from '../../../core/forms/control-events';
import { CardModel } from '../../../core/models/card.model';
import { ThemaModel } from '../../../core/models/thema.model';
import { FieldError } from '../../../shared/field-error/field-error';
import { SelectThemasModal } from '../../themas/select-themas-modal/select-themas-modal';

/**
 * The card form itself, with no opinion about where the card comes from or
 * where it goes: NewCardPage and CardPage both render this and handle the
 * request. The chosen themes are a control like any other, so the whole form —
 * text fields and themes alike — validates and resets as one group.
 */
@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './card-form.html',
  styleUrl: './card-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardForm {
  private readonly modalService = inject(NgbModal);

  /** The card to edit; leave it out to start an empty form. */
  readonly card = input<CardModel | null>(null);
  readonly saving = input(false);
  readonly submitLabel = input('Save');
  readonly deletable = input(false);

  readonly save = output<CardModel>();
  readonly remove = output<void>();

  readonly form = inject(FormBuilder).nonNullable.group({
    word: ['', [Validators.required, Validators.maxLength(200)]],
    transWord: ['', [Validators.required, Validators.maxLength(200)]],
    plural: ['', [Validators.maxLength(200)]],
    themas: [[] as ThemaModel[]],
  });

  readonly submitted = signal(false);

  private readonly events = controlEvents(this.form);
  readonly selectedThemas = computed(() => {
    this.events();
    return this.form.controls.themas.value;
  });

  constructor() {
    // The card arrives one request later than the form is built, and on
    // /cards/:id it changes again when the route id does.
    effect(() => {
      const card = this.card();
      this.submitted.set(false);
      this.form.reset({
        word: card?.word ?? '',
        transWord: card?.transWord ?? '',
        plural: card?.plural ?? '',
        themas: card?.themas ?? [],
      });
    });
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      id: this.card()?.id ?? 0,
      word: value.word.trim(),
      transWord: value.transWord.trim(),
      plural: value.plural.trim(),
      themas: value.themas,
    });
  }

  openThemaPicker(): void {
    const modal = this.modalService.open(SelectThemasModal, { centered: true, scrollable: true });
    // A copy, so dismissing the dialog leaves our own selection untouched.
    modal.componentInstance.selectedThemas = [...this.selectedThemas()];

    modal.result.then(
      (selected: ThemaModel[]) => this.setThemas(selected),
      () => undefined, // dismissed — keep what we had
    );
  }

  removeThema(id: number): void {
    this.setThemas(this.selectedThemas().filter((thema) => thema.id !== id));
  }

  private setThemas(themas: ThemaModel[]): void {
    this.form.controls.themas.setValue(themas);
    this.form.controls.themas.markAsDirty();
  }
}
