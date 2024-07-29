import {Route} from "@angular/router";
import {UsuariosResolvers} from "./usuarios.resolvers";
import {UsuariosComponent} from "./usuarios.component";

export const valeElectronicoRoutes: Route[] = [
    {
        path: "",
        component: UsuariosComponent,
        resolve: {
            data: UsuariosResolvers,
        },
    },
];
