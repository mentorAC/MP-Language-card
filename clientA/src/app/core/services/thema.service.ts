import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ThemaModel } from '../models/thema.model';

@Service()
export class ThemaService {
  private readonly url = '/api/themas';
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<ThemaModel[]>(this.url);
  }

  create(thema: ThemaModel) {
    return this.http.post<ThemaModel>(this.url, { name: thema.name });
  }

  update(thema: ThemaModel) {
    return this.http.put<ThemaModel>(this.url, thema);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
