import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiErrorMessage } from '../../../core/api-error';
import { CardModel } from '../../../core/models/card.model';
import { CardService } from '../../../core/services/card.service';
import { PageHeader } from '../../../shared/page-header/page-header';
import { CardForm } from '../card-form/card-form';

/** `/cards/:id` — one saved card: edit it, or delete it. */
@Component({
  selector: 'app-card-page',
  imports: [RouterLink, PageHeader, CardForm],
  templateUrl: './card-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage implements OnInit {
  private readonly cardService = inject(CardService);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly card = signal<CardModel | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.router.navigate(['/cards/new']);
        return;
      }

      this.load(id);
    });
  }

  save(card: CardModel): void {
    this.saving.set(true);

    this.cardService.update(card).subscribe({
      next: (saved) => {
        this.saving.set(false);
        // The saved card comes back with its theme names resolved, so the form
        // is re-seeded from the server's version rather than from what we sent.
        this.card.set(saved);
        this.toastr.success('The card is saved!');
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not save the card'));
      },
    });
  }

  remove(): void {
    const card = this.card();
    if (!card) {
      return;
    }

    this.saving.set(true);
    this.cardService.delete(card.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastr.success('The card is deleted');
        this.router.navigate(['/cards']);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not delete the card'));
      },
    });
  }

  private load(id: number): void {
    this.loading.set(true);
    this.cardService.getById(id).subscribe({
      next: (card) => {
        this.card.set(card);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not load the card'));
        this.router.navigate(['/cards']);
      },
    });
  }
}
