import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiErrorMessage } from '../../../core/api-error';
import { CardModel } from '../../../core/models/card.model';
import { emptyPage, PageModel } from '../../../core/models/page.model';
import { CardService } from '../../../core/services/card.service';
import { ThemaService } from '../../../core/services/thema.service';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { FieldError } from '../../../shared/field-error/field-error';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Pagination } from '../../../shared/pagination/pagination';

const PAGE_SIZE = 10;

/**
 * `/cards` — every card, or one theme's when `?thema=` is set. Both the theme
 * filter and the page number live in the URL, so any list you are looking at
 * can be linked to and survives a reload.
 */
@Component({
  selector: 'app-cards-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, EmptyState, FieldError, Pagination],
  templateUrl: './cards-page.html',
  styleUrl: './cards-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPage implements OnInit {
  private readonly cardService = inject(CardService);
  private readonly themaService = inject(ThemaService);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Quick add: the two columns the database insists on, nothing else. */
  readonly form = inject(FormBuilder).nonNullable.group({
    word: ['', [Validators.required, Validators.maxLength(200)]],
    transWord: ['', [Validators.required, Validators.maxLength(200)]],
  });

  readonly pageData = signal<PageModel<CardModel>>(emptyPage(PAGE_SIZE));
  readonly themaId = signal(0);
  readonly themaName = signal('');
  private readonly urlPage = signal(0);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly submitted = signal(false);

  readonly subtitle = computed(() =>
    this.themaName() ? `Theme: ${this.themaName()}` : 'Every card you have saved.',
  );

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const themaId = Math.max(0, Number(params.get('thema')) || 0);
      const page = Math.max(0, Number(params.get('page')) || 0);

      if (themaId !== this.themaId()) {
        this.themaId.set(themaId);
        this.loadThemaName(themaId);
      }

      this.urlPage.set(page);
      this.load(page);
    });
  }

  create(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    const card: CardModel = {
      id: 0,
      word: value.word.trim(),
      transWord: value.transWord.trim(),
      plural: '',
      // Without the theme the new card would exist but stay out of the list we
      // are looking at.
      themas: this.themaId() ? [{ id: this.themaId(), name: this.themaName() }] : [],
    };

    this.saving.set(true);
    this.cardService.create(card).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastr.success('The card is created!');
        this.submitted.set(false);
        this.form.reset({ word: '', transWord: '' });
        // Newest first, so a fresh card is on the first page.
        this.reload(0);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not create the card'));
      },
    });
  }

  goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page || null },
      queryParamsHandling: 'merge',
    });
  }

  /** See ThemaPage.reload — navigating to the current page emits nothing. */
  private reload(page: number): void {
    if (page === this.urlPage()) {
      this.load(page);
    } else {
      this.goToPage(page);
    }
  }

  private load(page: number): void {
    this.loading.set(true);
    this.cardService.getPage(this.themaId(), page, PAGE_SIZE).subscribe({
      next: (data) => {
        this.pageData.set(data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not load the cards'));
      },
    });
  }

  private loadThemaName(themaId: number): void {
    if (!themaId) {
      this.themaName.set('');
      return;
    }

    this.themaService.getById(themaId).subscribe({
      next: (thema) => this.themaName.set(thema.name),
      error: () => this.themaName.set(''),
    });
  }
}
