import { Route } from '@angular/router';
import { PedidosListaComponent } from './lista/lista.component';

export const pedidosRoutes: Route[] = [
    {
        path: 'pedidos',
        pathMatch: 'full',
        component: PedidosListaComponent
    },
    {
        path: 'pedidos/:id',
        //pathMatch: 'full',
        component: PedidosListaComponent
    },
];
