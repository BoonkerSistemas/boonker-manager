import { Route } from '@angular/router';
import { AcademyComponent } from 'app/modules/admin/academy/academy.component';
import { AcademyListComponent } from 'app/modules/admin/academy/list/list.component';

import { CarpetasComponent } from './carpetas/carpetas.component';
import { DetailsCarpetasComponent } from './carpetas/details/details.component';
import { CanDeactivateDetailsCarpetas } from './carpetas/carpetas.guards';
import { SettingsComponent } from '../settings/settings.component';
import { VisitaObraComponent } from './visita-obra/visita-obra.component';

export const academyRoutes: Route[] = [
    {
        path: '',
        component: AcademyComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: AcademyListComponent,
            },
            {
                path: 'setting/:id',
                component: SettingsComponent,
                children: [
                    {
                        path: 'details/:id',
                        component: DetailsCarpetasComponent,
                        canDeactivate: [CanDeactivateDetailsCarpetas],
                    },
                ],
            },
            {
                path: 'visita-obra/:idProyect',
                component: VisitaObraComponent,
            },
        ],
    },
];
