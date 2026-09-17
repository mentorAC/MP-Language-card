import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ThemaModel } from '../Models/thema.model';

@Service()
export class ThemaService {
  private readonly url = '/api/themas';
  private readonly _client = inject(HttpClient);
  getAll() {
    return this._client.get<ThemaModel[]>(this.url);
  }

  create(thema: ThemaModel) {
    return this._client.post<ThemaModel>(this.url, {name: thema.name});
  }
  delete(id: number) {
    return this._client.delete<void>(`${this.url}/${id}`);
  }
  update(thema: ThemaModel) {
    return this._client.put<ThemaModel>(this.url, thema);
  }
}
