import { Component, OnInit, ViewChild, ElementRef, Inject,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { EstudiantesService } from '../../../../../services/estudiante.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';


export interface PeriodicElement {
  ID: number;
  Nombre: string;
  CorreoElectronico: string;
  Editar: String;
  Eliminar: String;
}



@Component({
  selector: 'estudiante-table',
  styleUrl: 'estudiante-table.component.scss',
  templateUrl: 'estudiante-table.component.html',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule],
})
export class TableEstudiante implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'CorreoElectronico', 'Editar', 'Eliminar'];
  dataSource;
  estudiantes = [];
  estudianteAEditar = null; // Agrega esta línea
  @ViewChild('miModal') miModal: ElementRef;
  constructor(private http: HttpClient, private EstudiantesService: EstudiantesService, public dialog: MatDialog) { }
  
  
  ngOnInit() {
    this.EstudiantesService.estudianteActualizado$.subscribe(() => {
      this.obtenerEstudiantes();
    });


    this.obtenerEstudiantes();
  }

  obtenerEstudiantes() {
    this.http.get('http://localhost:8080/api/estudiantes').subscribe(
      (estudiantes: PeriodicElement[]) => {
        this.dataSource = estudiantes;
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }


  openDialogEstudiante(estudiante) {
    this.estudianteAEditar = estudiante;
    const dialogRef = this.dialog.open(EstudianteEditarModal, {
      data: { estudianteAEditar: this.estudianteAEditar } 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEliminar(id_estudiante): void {
    const dialogRef = this.dialog.open(EstudiateEliminarModal, {
      data: { ID: id_estudiante }  // Pasar el ID al diálogo
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'estudiante-edit-modal.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class EstudianteEditarModal {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EstudianteEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private EstudiantesService: EstudiantesService
  ) {

    this.form = new FormGroup({
      'id_estudiante': new FormControl(this.data.estudianteAEditar.id_estudiante),
      'nombre': new FormControl(this.data.estudianteAEditar.nombre),
      'apellido': new FormControl(this.data.estudianteAEditar.apellido),
      'email': new FormControl(this.data.estudianteAEditar.email)
    });
  }

  guardarCambios() {
    this.actualizarEstudiante(this.form.value).subscribe(
      () => {
        console.log('Estudiante actualizado:', this.form.value.id_estudiante);
        this.EstudiantesService.estudianteActualizado$.next();
        this.dialogRef.close(this.form.value);
      },
      error => console.error('Error al actualizar Estudiante:', error)
    );
  }


  actualizarEstudiante(estudiante) {
    return this.http.put(`http://localhost:8080/api/estudiantes/${estudiante.id_estudiante}`, estudiante, { responseType: 'text' });
  }


  showToast() {
    const toast = document.getElementById('toasteditar');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'estudiante-delete-modal.component.html',
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
export class EstudiateEliminarModal {
  constructor(
    public dialogRef: MatDialogRef<EstudiateEliminarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inyectar los datos del diálogo
    private http: HttpClient,
    private EstudiantesService: EstudiantesService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminarEstudiante() {
    const ID = this.data.ID;

    this.http.delete(`http://localhost:8080/api/estudiantes/${ID}`, ).subscribe(
      () => {
        this.showToast();
        console.log('Estudiante eliminado:', ID);
        this.EstudiantesService.estudianteEliminado();
      },
      error => console.error('Error al eliminar Estudiante:', error)
    );
  }

  showToast() {
    const toast = document.getElementById('toasteliminar');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }
}