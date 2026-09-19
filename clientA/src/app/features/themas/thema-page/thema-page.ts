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
import { emptyPage, PageModel } from '../../../core/models/page.model';
import { ThemaModel } from '../../../core/models/thema.model';
import { ThemaService } from '../../../core/services/thema.service';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { FieldError } from '../../../shared/field-error/field-error';
import { PageHeader } from '../../../shared/page-header/page-header';
import { Pagination } from '../../../shared/pagination/pagination';

/** Three columns on a wide screen, four rows of them. */
const PAGE_SIZE = 12;

@Component({
  selector: 'app-thema-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, EmptyState, FieldError, Pagination],
  templateUrl: './thema-page.html',
  styleUrl: './thema-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemaPage implements OnInit {
  private readonly themaService = inject(ThemaService);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  readonly pageData = signal<PageModel<ThemaModel>>(emptyPage(PAGE_SIZE));
  /** The page the URL currently points at — see `reload`. */
  private readonly urlPage = signal(0);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly submitted = signal(false);

  /** 0 while adding a theme, the theme's id while renaming one. */
  readonly editingId = signal(0);
  readonly isEditing = computed(() => this.editingId() !== 0);

  ngOnInit(): void {
    // The page number lives in the URL, so a pager step is a real history entry
    // and a link to page 3 still opens page 3.
    this.route.queryParamMap.subscribe((params) => {
      const page = Math.max(0, Number(params.get('page')) || 0);
      this.urlPage.set(page);
      this.load(page);
    });
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) {
      return;
    }

    const name = this.form.getRawValue().name.trim();
    const editingId = this.editingId();

    this.saving.set(true);
    const request = editingId
      ? this.themaService.update({ id: editingId, name })
      : this.themaService.create({ id: 0, name });

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.toastr.success(editingId ? 'The theme is renamed' : 'The theme is added');
        this.resetForm();
        // A new theme is the newest row, so it lands on the first page.
        this.reload(editingId ? this.pageData().page : 0);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not save the theme'));
      },
    });
  }

  remove(): void {
    const id = this.editingId();
    if (!id || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.themaService.delete(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastr.success('The theme is deleted');
        this.resetForm();

        // Deleting the only row of the last page would leave us on a page that
        // no longer exists.
        const page = this.pageData();
        this.reload(page.items.length === 1 && page.page > 0 ? page.page - 1 : page.page);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not delete the theme'));
      },
    });
  }

  startEdit(thema: ThemaModel): void {
    this.editingId.set(thema.id);
    this.submitted.set(false);
    this.form.reset({ name: thema.name });
  }

  resetForm(): void {
    this.editingId.set(0);
    this.submitted.set(false);
    this.form.reset({ name: '' });
  }

  /**
   * Shows `page` again after a change. Navigating to the page we are already on
   * emits nothing, so in that case the list is refetched directly.
   */
  private reload(page: number): void {
    if (page === this.urlPage()) {
      this.load(page);
    } else {
      this.goToPage(page);
    }
  }

  goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page || null },
      queryParamsHandling: 'merge',
    });
  }

  private load(page: number): void {
    this.loading.set(true);
    this.themaService.getPage(page, PAGE_SIZE).subscribe({
      next: (data) => {
        this.pageData.set(data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toastr.error(apiErrorMessage(error, 'Could not load the themes'));
      },
    });
  }
}
