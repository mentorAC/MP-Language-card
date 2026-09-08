import { HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModel } from '../../Models/card.model';
import { CardService } from '../../services/card.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-page',
  imports: [FormsModule],
  templateUrl: './card-page.html',
  styleUrl: './card-page.css',
})
export class CardPage implements OnInit {
  cardService = inject(CardService);
  route = inject(ActivatedRoute);
    cards = signal<CardModel[]>([]);
    card = new CardModel();
    
    ngOnInit(): void {
      this.route.queryParamMap.subscribe(pm => {
        const themaId = Number(pm.get("thema"));
        
        this.cardService.getAll(themaId).subscribe((res) => {
          this.cards.set(res);
        });
      })
    }
  
    //constructor(public client: HttpClient) {}
  
    pressButton() {
      if (!this.card.word.trim()) {
        console.log('Not working');
        return;
      }
      this.cardService.create(this.card).subscribe((res) => {
        this.cards.update((list) => [...list, res]);
        this.card = new CardModel();
      });
    }
    pressDelete() {
      this.cardService.delete(this.card.id)
      .subscribe(() => this.cards.update((l) => l.filter((t) => t.id !== this.card.id)));
      this.canselEdit();
    }
    startEdit(card: CardModel) {
      this.card = { ...card };
    }
    canselEdit() {
      this.card = new CardModel();
    }
    saveEdit() {
      if (!this.card.word.trim()) {
        return;
      }
      this.cardService.update(this.card).subscribe((res) => {
        this.cards.update((l) => {
          const index = l.findIndex((t) => t.id === this.card.id);
          l[index] = res;
          return l;
        });
        this.canselEdit();
      });
    }
}
