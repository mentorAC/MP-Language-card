import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CardModel } from '../../../core/models/card.model';
import { ThemaModel } from '../../../core/models/thema.model';
import { CardService } from '../../../core/services/card.service';
import { SelectThemasModal } from '../../themas/select-themas-modal/select-themas-modal';
import { PageHeader } from '../../../shared/page-header/page-header';

@Component({
  selector: 'app-new-card-page',
  imports: [FormsModule, RouterLink, PageHeader],
  templateUrl: './new-card-page.html',
  styleUrl: './new-card-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCardPage implements OnInit {
  private readonly cardService = inject(CardService);
  private readonly modalService = inject(NgbModal);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly card = signal<CardModel>(new CardModel());
  readonly selectedThemas = signal<ThemaModel[]>([]);

  /** `/card` creates, `/card/:id` edits — the same form serves both. */
  readonly isEditing = computed(() => this.card().id !== 0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.card.set(new CardModel());
        return;
      }

      this.cardService.getById(id).subscribe({
        next: (card) => this.card.set(card),
        error: () => this.toastr.error('Could not load the card'),
      });
    });
  }

  save(): void {
    const card = this.card();
    if (!card.word.trim()) {
      return;
    }

    const editing = this.isEditing();
    card.themaIds = this.selectedThemas().map((t) => t.id);

    const request = editing ? this.cardService.update(card) : this.cardService.create(card);
    request.subscribe({
      next: (saved) => {
        this.card.set(saved);
        this.toastr.success(editing ? 'The card is saved!' : 'The card is created!');
      },
      error: () => this.toastr.error('Could not save the card'),
    });
  }

  remove(): void {
    this.cardService.delete(this.card().id).subscribe({
      next: () => {
        this.toastr.success('The card is deleted');
        this.router.navigate(['/thema']);
      },
      error: () => this.toastr.error('Could not delete the card'),
    });
  }

  openThemaPicker(): void {
    const modal = this.modalService.open(SelectThemasModal, { centered: true });
    // A copy, so dismissing the dialog leaves our own selection untouched.
    modal.componentInstance.selectedThemas = [...this.selectedThemas()];

    modal.result.then(
      (selected: ThemaModel[]) => this.selectedThemas.set(selected),
      () => undefined, // dismissed — keep what we had
    );
  }

  removeThema(id: number): void {
    this.selectedThemas.update((list) => list.filter((t) => t.id !== id));
  }
}
