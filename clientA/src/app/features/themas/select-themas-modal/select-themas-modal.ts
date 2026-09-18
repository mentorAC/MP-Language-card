import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemaModel } from '../../../core/models/thema.model';
import { ThemaService } from '../../../core/services/thema.service';

@Component({
  selector: 'app-select-themas-modal',
  imports: [],
  templateUrl: './select-themas-modal.html',
  styleUrl: './select-themas-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectThemasModal implements OnInit {
  private readonly themaService = inject(ThemaService);

  readonly modal = inject(NgbActiveModal);
  readonly themas = signal<ThemaModel[]>([]);

  /** Set by whoever opens the dialog; closing hands it back through the result. */
  selectedThemas: ThemaModel[] = [];

  ngOnInit(): void {
    this.themaService.getAll().subscribe((themas) => this.themas.set(themas));
  }

  toggle(thema: ThemaModel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedThemas = checked
      ? [...this.selectedThemas, thema]
      : this.selectedThemas.filter((t) => t.id !== thema.id);
  }

  isSelected(thema: ThemaModel): boolean {
    return this.selectedThemas.some((t) => t.id === thema.id);
  }
}
