import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Dashboards
            {
                path: 'dashboards', children: [
                    { path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.routes') },

                ]
            },



            // Pages
            {
                path: 'pages', children: [

                    // Activities
                    { path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.routes') },


                    // Profile
                    { path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.routes') },

                    // Settings
                    { path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.routes') },
                ]
            },

            // User Interface
            {
                path: 'ui', children: [

                     // admin
                     { path: 'administrador', loadChildren: () => import('app/modules/admin/ui/administrador/administrador.routes') },


                    // estudiante
                    { path: 'estudiante', loadChildren: () => import('app/modules/admin/ui/estudiante/estudiante.routes') },

                    // profesor
                    { path: 'profesor', loadChildren: () => import('app/modules/admin/ui/profesor/profesor.routes') },

                    // materias
                    { path: 'materias', loadChildren: () => import('app/modules/admin/ui/materias/materias.routes') },


                    // materias para estudiante
                    { path: 'materias_por_estudiante', loadChildren: () => import('app/modules/admin/ui/materias_por_estudiante/materias_por_estudiante.routes') },

                    // materias para profesor
                    { path: 'materias_por_profesor', loadChildren: () => import('app/modules/admin/ui/materias_por_profesor/materias_por_profesor.routes') },



                ]
            },


        ]
    }
];
