import { Route } from '@angular/router';
import { DespachosListaComponent } from './lista/lista.component';

export const despachosRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: DespachosListaComponent,
    },
    {
        path: ':id',
        pathMatch: 'full',
        component: DespachosListaComponent,
    },
];
