import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModel } from '../../../core/models/card.model';
import { ThemaModel } from '../../../core/models/thema.model';
import { CardService } from '../../../core/services/card.service';
import { ThemaService } from '../../../core/services/thema.service';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { PageHeader } from '../../../shared/page-header/page-header';

@Component({
  selector: 'app-card-page',
  imports: [FormsModule, RouterLink, PageHeader, EmptyState],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage implements OnInit {
  private readonly cardService = inject(CardService);
  private readonly themaService = inject(ThemaService);
  private readonly route = inject(ActivatedRoute);

  readonly cards = signal<CardModel[]>([]);
  readonly themaId = signal(0);
  private readonly themas = signal<ThemaModel[]>([]);

  /** Derived, so the title follows the theme even if the query param changes. */
  readonly themaName = computed(
    () => this.themas().find((t) => t.id === this.themaId())?.name ?? '',
  );

  /** Quick-add form at the top of the list: a word, nothing else. */
  readonly draft = signal<CardModel>(new CardModel());

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const themaId = Number(params.get('thema'));
      this.themaId.set(themaId);

      this.cardService.getAll(themaId).subscribe((cards) => this.cards.set(cards));
    });

    this.themaService.getAll().subscribe((themas) => this.themas.set(themas));
  }

  create(): void {
    const word = this.draft().word.trim();
    if (!word) {
      return;
    }

    // Without the theme id the new card would be created but would not belong
    // to the list we are looking at.
    this.draft().themaIds = this.themaId() ? [this.themaId()] : [];

    this.cardService.create(this.draft()).subscribe((created) => {
      this.cards.update((list) => [...list, created]);
      this.draft.set(new CardModel());
    });
  }
}
