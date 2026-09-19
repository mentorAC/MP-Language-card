import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** A gap in the page numbers, rendered as an ellipsis. */
const GAP = '…' as const;

/**
 * Pager for every list in the app. Pages are 0-based on the wire — the same as
 * the API — and shown 1-based, which is the only place the two differ.
 */
@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly total = input<number>(0);
  readonly size = input<number>(0);
  /** What the list is counted in, for the summary line: "3 of 12 themes". */
  readonly label = input<string>('items');

  readonly pageChange = output<number>();

  readonly hasPages = computed(() => this.totalPages() > 1);

  readonly firstItem = computed(() => (this.total() ? this.page() * this.size() + 1 : 0));
  readonly lastItem = computed(() => Math.min(this.total(), (this.page() + 1) * this.size()));

  /**
   * The first page, the last one and a window around the current one. Long
   * lists therefore keep the pager a fixed width instead of wrapping.
   */
  readonly pageNumbers = computed<(number | typeof GAP)[]>(() => {
    const totalPages = this.totalPages();
    const current = this.page();

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const numbers: (number | typeof GAP)[] = [0];
    const from = Math.max(1, Math.min(current - 1, totalPages - 4));
    const to = Math.min(totalPages - 2, Math.max(current + 1, 3));

    if (from > 1) {
      numbers.push(GAP);
    }
    for (let i = from; i <= to; i++) {
      numbers.push(i);
    }
    if (to < totalPages - 2) {
      numbers.push(GAP);
    }

    numbers.push(totalPages - 1);
    return numbers;
  });

  isGap(entry: number | typeof GAP): entry is typeof GAP {
    return entry === GAP;
  }

  go(page: number): void {
    if (page !== this.page() && page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
