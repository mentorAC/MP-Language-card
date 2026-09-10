import { Component, inject, signal } from '@angular/core';
import { CardService } from '../../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { CardModel } from '../../Models/card.model';

@Component({
  selector: 'app-new-card-page',
  imports: [],
  templateUrl: './new-card-page.html',
  styleUrl: './new-card-page.css',
})
export class NewCardPage {
  cardService = inject(CardService);
    card = new CardModel();
  
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
