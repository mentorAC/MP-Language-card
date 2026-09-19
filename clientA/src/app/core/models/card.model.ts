import { ThemaModel } from './thema.model';

export class CardModel {
  id = 0;
  word = '';
  transWord = '';
  plural = '';

  /**
   * Both directions of the card <-> theme link: reads carry the names, writes
   * only need the ids, and the server ignores the rest.
   */
  themas: ThemaModel[] = [];
}
