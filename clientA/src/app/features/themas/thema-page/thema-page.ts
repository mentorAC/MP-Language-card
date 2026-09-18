import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemaModel } from '../../../core/models/thema.model';
import { ThemaService } from '../../../core/services/thema.service';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { PageHeader } from '../../../shared/page-header/page-header';

@Component({
  selector: 'app-thema-page',
  imports: [FormsModule, RouterLink, PageHeader, EmptyState],
  templateUrl: './thema-page.html',
  styleUrl: './thema-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemaPage implements OnInit {
  private readonly themaService = inject(ThemaService);

  readonly themas = signal<ThemaModel[]>([]);

  /** The theme in the form: a blank one while creating, a copy while renaming. */
  readonly draft = signal<ThemaModel>(new ThemaModel());
  readonly isEditing = computed(() => this.draft().id !== 0);

  ngOnInit(): void {
    this.themaService.getAll().subscribe((themas) => this.themas.set(themas));
  }

  submit(): void {
    if (this.isEditing()) {
      this.saveEdit();
    } else {
      this.create();
    }
  }

  create(): void {
    const name = this.draft().name.trim();
    if (!name) {
      return;
    }

    this.themaService.create(this.draft()).subscribe((created) => {
      this.themas.update((list) => [...list, created]);
      this.resetDraft();
    });
  }

  saveEdit(): void {
    if (!this.draft().name.trim()) {
      return;
    }

    this.themaService.update(this.draft()).subscribe((updated) => {
      // A new array, not an in-place write: a signal only notifies when the
      // reference it holds actually changes.
      this.themas.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      this.resetDraft();
    });
  }

  remove(): void {
    const id = this.draft().id;
    this.themaService.delete(id).subscribe(() => {
      this.themas.update((list) => list.filter((t) => t.id !== id));
      this.resetDraft();
    });
  }

  startEdit(thema: ThemaModel): void {
    this.draft.set({ ...thema });
  }

  resetDraft(): void {
    this.draft.set(new ThemaModel());
  }
}
