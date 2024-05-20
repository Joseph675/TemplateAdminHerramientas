import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { EstudiantesService } from '../../../../../services/estudiante.service';
import { ToastService } from '../../../../../services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';

export interface PeriodicElement {
  ID: number;
  Nombre: string;
  CorreoElectronico: string;
  Editar: String;
  Eliminar: String;
}

@Component({
  selector: 'administrador-table',
  styleUrl: 'administrador-table.component.scss',
  templateUrl: 'administrador-table.component.html',
  standalone: true,
  imports: [MatMenuModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule, MatPaginatorModule],
})
export class TableAdministrador implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'CorreoElectronico', 'Rol', 'Acciones'];
  dataSource;
  administradorAEditar = null; // Agrega esta línea
  @ViewChild('miModal') miModal: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private toastService: ToastService, private http: HttpClient, private EstudiantesService: EstudiantesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.EstudiantesService.estudianteActualizado$.subscribe(() => {
      this.obtenerAdministradores();
    });

    this.toastService.showToastEditar.subscribe(() => {
      this.showToastEditar();
    });

    this.toastService.showToastEmail.subscribe(() => {
      this.showToastEmail();
    });

    this.toastService.showToastEliminar.subscribe(() => {
      this.showToastEliminar();
    });

    this.obtenerAdministradores();
  }

  obtenerAdministradores() {
    this.http.get('http://localhost:8080/api/administradores').subscribe(
      (administradores: PeriodicElement[]) => {
        for (let i = 0; i < administradores.length; i++) {
          let administrador = administradores[i];
        }
        this.dataSource = new MatTableDataSource(administradores); // Usa MatTableDataSource
        this.dataSource.paginator = this.paginator; // Asigna el paginador aquí
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }



  openDialogAdministrador(administrador) {
    this.administradorAEditar = administrador;
    const dialogRef = this.dialog.open(AdministradorEditarModal, {
      data: { administradorAEditar: this.administradorAEditar }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEliminar(id_administrador): void {
    const dialogRef = this.dialog.open(AdministradorEliminarModal, {
      data: { ID: id_administrador }  // Pasar el ID al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  showToastEditar() {
    const toast = document.getElementById('toasteditar');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }


  showToastEmail() {
    const toast = document.getElementById('toastemail');
    toast.classList.remove('hide');
    toast.classList.add('show');
    console.log("hoalaaaa")
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }

  showToastEliminar() {
    const toast = document.getElementById('toastEliminar');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }



  exportarexcel() {
    window.location.href = 'http://localhost:8080/api/administradores/exportExcel';
  }

  exportarword() {
    window.location.href = 'http://localhost:8080/api/administradores/exportWord';
  }

  exportartxt() {
    window.location.href = 'http://localhost:8080/api/administradores/exportTxt';
  }

}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'administrador-edit-modal.component.html',
  styleUrl: 'administrador-table.component.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class AdministradorEditarModal {
  form: FormGroup;


  constructor(private toastService: ToastService,
    public dialogRef: MatDialogRef<AdministradorEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private EstudiantesService: EstudiantesService
  ) {

    this.form = new FormGroup({
      'id_administrador': new FormControl(this.data.administradorAEditar.id_administrador),
      'nombre': new FormControl(this.data.administradorAEditar.nombre),
      'apellido': new FormControl(this.data.administradorAEditar.apellido),
      'email': new FormControl(this.data.administradorAEditar.email)
    });
  }

  guardarCambios() {
    this.actualizarAdministrador(this.form.value).subscribe(
      () => {
        console.log('Administrador actualizado:', this.form.value.id_administrador);
        this.EstudiantesService.estudianteActualizado$.next();
        this.toastService.showEditar();
        this.dialogRef.close(this.form.value);
      },
      error => {
        console.error('Error al actualizar Administrador:', error);
        this.dialogRef.close(this.form.value);
        this.toastService.showEmail();

      }
    );
  }


  actualizarAdministrador(administrador) {
    return this.http.put(`http://localhost:8080/api/administradores/${administrador.id_administrador}`, administrador, { responseType: 'text' });
  }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'administrador-delete-modal.component.html',
  styleUrl: 'administrador-table.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule
  ],
})
export class AdministradorEliminarModal {
  constructor(private toastService: ToastService, public dialogRef: MatDialogRef<AdministradorEliminarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inyectar los datos del diálogo
    private http: HttpClient,
    private EstudiantesService: EstudiantesService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminarAdministrador() {
    const ID = this.data.ID;

    this.http.delete(`http://localhost:8080/api/administradores/${ID}`,).subscribe(
      () => {
        console.log('Administrador eliminado:', ID);
        this.EstudiantesService.estudianteActualizado$.next();
        this.toastService.showEliminar();

      },
      error => console.error('Error al eliminar Estudiante:', error)
    );
  }


}

