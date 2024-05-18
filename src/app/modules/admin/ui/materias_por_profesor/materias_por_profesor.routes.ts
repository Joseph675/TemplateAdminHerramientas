import { Routes } from '@angular/router';
import { Tablematerias_por_profesor } from 'app/modules/admin/ui/materias_por_profesor/materias_por_profesor-table/materias_por_profesor-table.component';
import { Formsmaterias_por_profesor } from 'app/modules/admin/ui/materias_por_profesor/materias_por_profesor-add/materias_por_profesor-add.component';

export default [
    {
        path     : 'materias_por_profesor-table',
        component:  Tablematerias_por_profesor,
    },
    {
        path     : 'materias_por_profesor-add',
        component:  Formsmaterias_por_profesor,
    },
] as Routes;
