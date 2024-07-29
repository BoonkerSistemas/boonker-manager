import { Route } from '@angular/router';
import { ProjectComponent } from 'app/modules/dashboards/project/project.component';
import { ProjectResolver } from 'app/modules/dashboards/project/project.resolvers';

export const projectRoutes: Route[] = [
    {
        path: '',
        component: ProjectComponent,
        resolve: {
            data: ProjectResolver,
        },
    },
];
