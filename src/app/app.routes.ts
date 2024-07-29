import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { UnidadesModule } from './modules/admin/unidades/unidades.module';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'academy' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },

        children: [
            {
                path: 'example',
                loadChildren: () =>
                    import('app/modules/admin/example/example.routes'),
            },
            {
                path: 'config/user',
                loadChildren: () =>
                    import('app/modules/admin/usuarios/usuarios.module').then(
                        (m) => m.UsuariosModule
                    ),
            },
            {
                path: 'config/role',
                loadChildren: () =>
                    import('app/modules/admin/roles/roles.module').then(
                        (m) => m.RolesModule
                    ),
            },
            {
                path: 'clientes',
                loadChildren: () =>
                    import('app/modules/admin/cliente/cliente.module').then(
                        (m) => m.ClienteModule
                    ),
            },
            {
                path: 'projects',
                loadChildren: () =>
                    import('app/modules/admin/slide/slide.module').then(
                        (m) => m.SlideModule
                    ),
            },
            {
                path: 'proyectos/:id',
                loadChildren: () =>
                    import('app/modules/admin/proyectos/proyectos.module').then(
                        (m) => m.ProyectosModule
                    ),
            },

            {
                path: 'detallesMateriales',
                loadChildren: () =>
                    import(
                        'app/modules/admin/detalles-materiales/detalles-materiales.module'
                    ).then((m) => m.DetallesMaterialesModule),
            },
            {
                path: 'despachos',
                loadChildren: () =>
                    import('app/modules/admin/despachos/despachos.module').then(
                        (m) => m.DespachosModule
                    ),
            },
            {
                path: 'academy',
                loadChildren: () =>
                    import('app/modules/admin/academy/academy.module').then(
                        (m) => m.AcademyModule
                    ),
            },
            {
                path: 'file-upload/:id',
                loadChildren: () =>
                    import(
                        'app/modules/admin/slide/list-upload/list-upload.module'
                    ).then((m) => m.ListUploadModule),
            },
            {
                path: 'upload-file/:id',
                loadChildren: () =>
                    import(
                        'app/modules/admin/slide/upload-file/upload-file.module'
                    ).then((m) => m.UploadFileModule),
            },

            {
                path: 'endoso',
                loadChildren: () =>
                    import('app/modules/admin/endoso/endoso.routes'),
            },
            {
                path: 'setting',
                loadChildren: () =>
                    import('app/modules/admin/settings/settings.routes'),
            },
            {
                path: 'academy',
                loadChildren: () =>
                    import('app/modules/admin/academy/academy.module').then(
                        (m) => m.AcademyModule
                    ),
            },
            {
                path: 'unidades',
                loadChildren: () =>
                    import('app/modules/admin/unidades/unidades.module').then(
                        (m) => m.UnidadesModule
                    ),
            },

            {
                path: 'cliente-despachos',
                loadChildren: () =>
                    import(
                        'app/modules/admin/cliente-despachos/cliente-despachos.module'
                    ).then((m) => m.ClienteDespachosModule),
            },

            {
                path: 'dashboard',
                loadChildren: () =>
                    import(
                        'app/modules/dashboards/project/project.module'
                    ).then((m) => m.ProjectModule),
            },

        ],
    },
];
