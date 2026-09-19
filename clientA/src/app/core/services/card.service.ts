import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CardModel } from '../models/card.model';
import { PageModel } from '../models/page.model';

@Service()
export class CardService {
  private readonly url = '/api/cards';
  private readonly http = inject(HttpClient);

  /** `themaId` of 0 asks for every card instead of one theme's. */
  getPage(themaId: number, page: number, size: number) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (themaId) {
      params = params.set('themaId', themaId);
    }

    return this.http.get<PageModel<CardModel>>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<CardModel>(`${this.url}/${id}`);
  }

  create(card: CardModel) {
    return this.http.post<CardModel>(this.url, card);
  }

  update(card: CardModel) {
    return this.http.put<CardModel>(this.url, card);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
