import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PageModel } from '../models/page.model';
import { ThemaModel } from '../models/thema.model';

@Service()
export class ThemaService {
  private readonly url = '/api/themas';
  private readonly http = inject(HttpClient);

  getPage(page: number, size: number) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageModel<ThemaModel>>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<ThemaModel>(`${this.url}/${id}`);
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
