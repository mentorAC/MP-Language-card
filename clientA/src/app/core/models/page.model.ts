/** What every list endpoint returns: the rows of one page plus the pager's state. */
export interface PageModel<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

/** A page-shaped value for a list that has not been loaded yet. */
export function emptyPage<T>(size: number): PageModel<T> {
  return { items: [], page: 0, size, total: 0, totalPages: 0 };
}
