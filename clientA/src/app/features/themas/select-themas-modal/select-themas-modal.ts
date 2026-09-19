import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { emptyPage, PageModel } from '../../../core/models/page.model';
import { ThemaModel } from '../../../core/models/thema.model';
import { ThemaService } from '../../../core/services/thema.service';
import { Pagination } from '../../../shared/pagination/pagination';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-select-themas-modal',
  imports: [Pagination],
  templateUrl: './select-themas-modal.html',
  styleUrl: './select-themas-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectThemasModal implements OnInit {
  private readonly themaService = inject(ThemaService);

  readonly modal = inject(NgbActiveModal);
  readonly pageData = signal<PageModel<ThemaModel>>(emptyPage(PAGE_SIZE));
  readonly loading = signal(false);

  /**
   * Set by whoever opens the dialog; closing hands it back through the result.
   * It spans every page — paging away from a theme does not unselect it.
   */
  selectedThemas: ThemaModel[] = [];
  readonly selection = signal<ThemaModel[]>([]);

  ngOnInit(): void {
    this.selection.set([...this.selectedThemas]);
    this.load(0);
  }

  toggle(thema: ThemaModel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selection.update((selected) =>
      checked ? [...selected, thema] : selected.filter((t) => t.id !== thema.id),
    );
  }

  isSelected(thema: ThemaModel): boolean {
    return this.selection().some((t) => t.id === thema.id);
  }

  load(page: number): void {
    this.loading.set(true);
    this.themaService.getPage(page, PAGE_SIZE).subscribe({
      next: (data) => {
        this.pageData.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
