/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'apps.User',
        title: 'Configuracion Usuarios',
        type: 'collapsable',
        code: 'US1',
        icon: 'heroicons_outline:user',
        children: [
            {
                id: 'apps.time',
                title: 'Usuarios',
                type: 'basic',
                code: 'Notificaciones',
                icon: 'heroicons_outline:user',
                link: '/config/user',
            },
            {
                id: 'apps.timeuser',
                title: 'Roles',
                type: 'basic',
                code: 'Notificaciones',
                icon: 'heroicons_outline:user',
                link: '/config/role',
            },
        ],
    },

    {
        id: 'cliente',
        title: 'Cliente',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/clientes',
        code: 'Notificaciones',
    },
    {
        id: 'project',
        title: 'Proyectos',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/projects',
        code: 'Notificaciones',
    },
    {
        id: 'academy',
        title: 'Proyectos Boonker',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/academy',
        code: 'Notificaciones',
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'apps.User',
        title: 'Configuracion Usuarios',
        type: 'collapsable',
        code: 'US1',
        icon: 'heroicons_outline:user',
        children: [
            {
                id: 'apps.time',
                title: 'Usuarios',
                type: 'basic',
                code: 'Notificaciones',
                icon: 'heroicons_outline:user',
                link: '/config/user',
            },
            {
                id: 'apps.timeuser',
                title: 'Roles',
                type: 'basic',
                code: 'Notificaciones',
                icon: 'heroicons_outline:user',
                link: '/config/role',
            },
        ],
    },
    {
        id: 'cliente',
        title: 'Cliente',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/clientes',
        code: 'Notificaciones',
    },
    {
        id: 'project',
        title: 'Proyectos',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/projects',
        code: 'Notificaciones',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        code: 'Notificaciones',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'proyectos',
        title: 'Mis Proyectos',
        type: 'basic',
        code: '',
        icon: 'heroicons_outline:home-modern',
        link: '/academy',
    },

    /*{
        id: 'endoso',
        title: 'Mis Unidades de Vivienda',
        type: 'basic',
        code: '',
        icon: 'heroicons_outline:home',
        link: '/unidades',
    },*/


    {
        id: 'Visitar Boonker',
        title: 'Visitar Boonker',
        type: 'basic',
        code: '',
        icon: 'mat_outline:reviews',
        function() {
            window.open('https://www.boonkerconstrucciones.com/');
        },
    },
    {
        id: 'Visitar Rinnova',
        title: 'Visitar Rinnova',
        type: 'basic',
        code: '',
        icon: 'mat_outline:reviews',
        function() {
            window.open('https://www.rinnova.com.ec/');
        },
    },
];
