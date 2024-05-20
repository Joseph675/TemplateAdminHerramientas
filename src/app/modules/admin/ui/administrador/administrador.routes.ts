import { Routes } from '@angular/router';
import { TableAdministrador } from 'app/modules/admin/ui/administrador/administrador-table/administrador-table.component';
import { FormsAdministradorAdd } from 'app/modules/admin/ui/administrador/administrador-add/administrador-add.component';

export default [
    {
        path     : 'administrador-table',
        component: TableAdministrador,
    },
    {
        path     : 'administrador-add',
        component: FormsAdministradorAdd,
    },
] as Routes;
