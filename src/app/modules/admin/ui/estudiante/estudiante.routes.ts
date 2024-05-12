import { Routes } from '@angular/router';
import { TableEstudiante } from 'app/modules/admin/ui/estudiante/estudiante-table/estudiante-table.component';
import { FormsEstudianteAdd } from 'app/modules/admin/ui/estudiante/estudiante-add/estudiante-add.component';

export default [
    {
        path     : 'estudiante-table',
        component: TableEstudiante,
    },
    {
        path     : 'estudiante-add',
        component: FormsEstudianteAdd,
    },
] as Routes;
