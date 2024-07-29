import { Route } from '@angular/router';
import { DetallesMaterialesListaComponent } from './lista/lista.component';
import { DetallesMaterialesComponent } from './detalles/detalles.component';

export const detallesMaterialesRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: DetallesMaterialesListaComponent,
    },
    {
        path: ':id',
        //pathMatch: 'full',
        component: DetallesMaterialesComponent,
    },
];
