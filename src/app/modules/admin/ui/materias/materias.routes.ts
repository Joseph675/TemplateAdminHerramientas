import { Routes } from '@angular/router';
import { TableMateria } from 'app/modules/admin/ui/materias/materias-table/materia-table.component';
import { FormsMateriaAdd } from 'app/modules/admin/ui/materias/materias-add/materia-add.component';

export default [
    {
        path     : 'materias-table',
        component: TableMateria,
    },
    {
        path     : 'materias-add',
        component: FormsMateriaAdd,
    },
] as Routes;
