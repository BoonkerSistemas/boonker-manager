import { Route } from '@angular/router';
import { ClienteDespachosComponent } from './cliente-despachos.component';
import { ListaDespachosComponent } from './lista-despachos/lista-despachos.component';
import { ProjectComponent } from 'app/modules/dashboards/project/project.component';
import { ProjectResolver } from 'app/modules/dashboards/project/project.resolvers';
import {ListaDespachos1Component} from "./lista-despachos-1/lista-despachos-1.component";

export const valeElectronicoRoutes: Route[] = [
    {
        path: '',
        component: ClienteDespachosComponent,
    },
    {
        path: 'lista/:id',
        component: ListaDespachosComponent,
    },
    {
        path: 'dashboard/:id',
        component: ProjectComponent,
        resolve: {
            data: ProjectResolver,
        },
    },
    {
        path: 'lista-despachos/:id',
        component: ListaDespachos1Component,
    },
];
