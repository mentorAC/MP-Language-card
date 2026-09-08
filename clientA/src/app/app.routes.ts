import { Routes } from '@angular/router';
import { ThemaPage } from './components/thema-page/thema-page';
import { CardPage } from './components/card-page/card-page';
import { Counter } from './counter/counter';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "thema",
        pathMatch: "full"
    },
    {
        path: 'thema',
        component: ThemaPage
    },
    {
        path: 'cards',
        component: CardPage
    },
    {
        path: "**",
        component: Counter
    }
];
