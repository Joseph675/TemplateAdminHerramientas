import { Routes } from '@angular/router';
import { TableProfesor } from 'app/modules/admin/ui/profesor/profesor-table/profesor-table.component';
import { FormsProfesorAdd } from 'app/modules/admin/ui/profesor/profesor-add/profesor-add.component';

export default [
    {
        path     : 'profesor-table',
        component: TableProfesor,
    },
    {
        path     : 'profesor-add',
        component: FormsProfesorAdd,
    },
] as Routes;
