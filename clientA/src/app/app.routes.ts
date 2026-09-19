import { Routes } from '@angular/router';

/**
 * Every page is loaded on demand, so opening the app only downloads the shell
 * plus the page you actually landed on.
 *
 * The paths name what they hold: a list at `/themas` and `/cards`, the new-card
 * form at `/cards/new`, and one saved card at `/cards/:id`. `/thema` and
 * `/card` are the shapes the app used to have and still redirect, so older
 * links and bookmarks keep working.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'themas',
    pathMatch: 'full',
  },
  {
    path: 'themas',
    title: 'Themes · LanguageCard',
    loadComponent: () => import('./features/themas/thema-page/thema-page').then((m) => m.ThemaPage),
  },
  {
    path: 'cards',
    title: 'Cards · LanguageCard',
    loadComponent: () => import('./features/cards/cards-page/cards-page').then((m) => m.CardsPage),
  },
  {
    path: 'cards/new',
    title: 'New card · LanguageCard',
    loadComponent: () =>
      import('./features/cards/new-card-page/new-card-page').then((m) => m.NewCardPage),
  },
  {
    path: 'cards/:id',
    title: 'Edit card · LanguageCard',
    loadComponent: () => import('./features/cards/card-page/card-page').then((m) => m.CardPage),
  },

  // Superseded paths.
  { path: 'thema', redirectTo: 'themas' },
  { path: 'card', redirectTo: 'cards/new', pathMatch: 'full' },
  { path: 'card/:id', redirectTo: 'cards/:id' },

  {
    path: '**',
    title: 'Page not found · LanguageCard',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
