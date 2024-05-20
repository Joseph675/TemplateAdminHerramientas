import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TableActivities } from 'app/modules/admin/pages/activities/actividades-table/activities.component';
import { FormsActividadesAdd } from 'app/modules/admin/pages/activities/actividades-form/activities.component';

export default [
    {
        path     : 'actividades-table',
        component: TableActivities,
    },
    {
        path     : 'actividades-add',
        component: FormsActividadesAdd,
    },
] as Routes;
