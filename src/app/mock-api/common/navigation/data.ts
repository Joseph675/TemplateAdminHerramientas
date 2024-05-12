/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-document-check',
                link : '/dashboards/project',
            }
        ],
    },
    
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document',
        children: [
            {
                id   : 'pages.activities',
                title: 'Activities',
                type : 'basic',
                icon : 'heroicons_outline:bars-3-bottom-left',
                link : '/pages/activities',
            },
          
            {
                id   : 'pages.profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:user-circle',
                link : '/pages/profile',
            },
            {
                id   : 'pages.settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog-8-tooth',
                link : '/pages/settings',
            },
        ],
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [
            {
                id      : 'estudiante-interface.forms',
                title   : 'Estudiantes',
                type    : 'collapsable',
                icon    : 'heroicons_outline:users',
                children: [
                    {
                        id   : 'user-interface.forms.fields',
                        title: 'Añadir Estudiantes',
                        type : 'basic',
                        link : '/ui/estudiante/estudiante-add',
                    },
                    {
                        id   : 'user-interface.forms.layouts',
                        title: 'Ver Estudiantes',
                        type : 'basic',
                        link : '/ui/estudiante/estudiante-table',
                    }
                ],
            },
            {
                id      : 'materia-interface.forms',
                title   : 'Materias',
                type    : 'collapsable',
                icon    : 'heroicons_outline:academic-cap',
                children: [
                    {
                        id   : 'materia-interface.forms.fields',
                        title: 'Añadir Materias',
                        type : 'basic',
                        link : '/ui/materias/materias-add',
                    },
                    {
                        id   : 'materia-interface.forms.layouts',
                        title: 'Ver Materias',
                        type : 'basic',
                        link : '/ui/materias/materias-table',
                    }
                ],
            }
            
        ],
    },
   
   
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        tooltip : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        tooltip : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation',
        tooltip : 'Navigation',
        type    : 'aside',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group',
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation Features',
        type    : 'aside',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Misc',
        type    : 'group',
        icon    : 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];