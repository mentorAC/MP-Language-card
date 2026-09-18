import { Routes } from '@angular/router';

/**
 * Every page is loaded on demand, so opening the app only downloads the shell
 * plus the page you actually landed on.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'thema',
    pathMatch: 'full',
  },
  {
    path: 'thema',
    title: 'Themes · LanguageCard',
    loadComponent: () => import('./features/themas/thema-page/thema-page').then((m) => m.ThemaPage),
  },
  {
    path: 'cards',
    title: 'Cards · LanguageCard',
    loadComponent: () => import('./features/cards/card-page/card-page').then((m) => m.CardPage),
  },
  {
    path: 'card',
    title: 'New card · LanguageCard',
    loadComponent: () =>
      import('./features/cards/new-card-page/new-card-page').then((m) => m.NewCardPage),
  },
  {
    path: 'card/:id',
    title: 'Edit card · LanguageCard',
    loadComponent: () =>
      import('./features/cards/new-card-page/new-card-page').then((m) => m.NewCardPage),
  },
  {
    path: '**',
    title: 'Page not found · LanguageCard',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
