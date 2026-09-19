import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiErrorMessage } from '../../../core/api-error';
import { CardModel } from '../../../core/models/card.model';
import { CardService } from '../../../core/services/card.service';
import { PageHeader } from '../../../shared/page-header/page-header';
import { CardForm } from '../card-form/card-form';

/** `/cards/new` — creates a card and hands it over to its own edit page. */
@Component({
  selector: 'app-new-card-page',
  imports: [RouterLink, PageHeader, CardForm],
  templateUrl: './new-card-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCardPage {
  private readonly cardService = inject(CardService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  readonly saving = signal(false);

  create(card: CardModel): void {
    this.saving.set(true);

    this.cardService.create(card).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.toastr.success('The card is created!');
        this.router.navigate(['/cards', created.id]);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not create the card'));
      },
    });
  }
}
