import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemaModel } from '../../Models/thema.model';
import { ThemaService } from '../../services/thema.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-thema-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './thema-page.html',
  styleUrl: './thema-page.css',
})
export class ThemaPage implements OnInit {
  themaService = inject(ThemaService);
  themas = signal<ThemaModel[]>([]);
  
  thema = new ThemaModel();
  ngOnInit(): void {
    this.themaService.getAll().subscribe((res) => {
      this.themas.set(res);
    });
  }

  //constructor(public client: HttpClient) {}

  pressButton() {
    if (!this.thema.name.trim()) {
      console.log('Not working');
      return;
    }
    this.themaService.create(this.thema).subscribe((res) => {
      this.themas.update((list) => [...list, res]);
      this.thema = new ThemaModel();
    });
  }
  pressDelete() {
    this.themaService.delete(this.thema.id)
    .subscribe(() => this.themas.update((l) => l.filter((t) => t.id !== this.thema.id)));
    this.cancelEdit();
  }
  startEdit(theme: ThemaModel) {
    this.thema = { ...theme };
  }
  cancelEdit() {
    this.thema = new ThemaModel();
  }
  saveEdit() {
    if (!this.thema.name.trim()) {
      return;
    }
    this.themaService.update(this.thema).subscribe((res) => {
      this.themas.update((l) => {
        const index = l.findIndex((t) => t.id === this.thema.id);
        l[index] = res;
        return l;
      });
      this.cancelEdit();
    });
  }
}
