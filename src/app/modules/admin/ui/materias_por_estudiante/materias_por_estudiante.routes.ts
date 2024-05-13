import { Routes } from '@angular/router';
import { Tablematerias_por_estudiante } from 'app/modules/admin/ui/materias_por_estudiante/materias_por_estudiante-table/materias_por_estudiante-table.component';
import { Formsmaterias_por_estudiante } from 'app/modules/admin/ui/materias_por_estudiante/materias_por_estudiante-add/materias_por_estudiante-add.component';

export default [
    {
        path     : 'materias_por_estudiante-table',
        component:  Tablematerias_por_estudiante,
    },
    {
        path     : 'materias_por_estudiante-add',
        component:  Formsmaterias_por_estudiante,
    },
] as Routes;
