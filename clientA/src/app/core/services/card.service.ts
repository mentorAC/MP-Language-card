import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { CardModel } from '../models/card.model';

@Service()
export class CardService {
  private readonly url = '/api/cards';
  private readonly http = inject(HttpClient);

  getAll(themaId: number) {
    const params = new HttpParams().append('themaId', themaId);
    return this.http.get<CardModel[]>(this.url, { params });
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
