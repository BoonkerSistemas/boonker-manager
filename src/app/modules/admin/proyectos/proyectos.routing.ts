import { Route } from '@angular/router';
import { ListaProyectosComponent } from './lista-proyectos/lista-proyectos.component';

export const proyectosRoutes: Route[] = [

    {
        path: '',
        pathMatch: 'full',
         component: ListaProyectosComponent,
    },
    {
        path: 'proyectos/:id',
        component: ListaProyectosComponent,
        children: [],
    },

];

