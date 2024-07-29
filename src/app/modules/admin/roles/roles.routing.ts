import {Route} from "@angular/router";
import {RolesResolvers} from "./roles.resolvers";
import {RolesComponent} from "./roles.component";

export const valeElectronicoRoutes: Route[] = [
    {
        path: "",
        component: RolesComponent,
        resolve: {
            data: RolesResolvers,
        },
    },
];
