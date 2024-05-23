import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TablaAsistencias } from 'app/modules/admin/pages/asistencias/asistencias-table/asistencias-table.component';
import { FormsAsistenciasAdd } from 'app/modules/admin/pages/asistencias/asistencias-form/asistencias-form.component';

export default [
    {
        path     : 'asistencias-table',
        component: TablaAsistencias,
    },
    {
        path     : 'asistencias-add',
        component: FormsAsistenciasAdd,
    },
] as Routes;
