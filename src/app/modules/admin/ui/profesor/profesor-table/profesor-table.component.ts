import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProfesoresService } from '../../../../../services/profesor.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';


export interface PeriodicElement {
}

@Component({
  selector: 'profesor-table',
  styleUrl: 'profesor-table.component.scss',
  templateUrl: 'profesor-table.component.html',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule],
})
export class TableProfesor implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'CorreoElectronico', 'Acciones'];
  listaprofesores;
  profesores = [];
  profesorAEditar = null; // Agrega esta línea
  @ViewChild('miModal') miModal: ElementRef;
  constructor(private http: HttpClient, private ProfesoresService: ProfesoresService, public dialog: MatDialog) { }
  ngOnInit() {
    this.ProfesoresService.profesorActualizado$.subscribe(() => {
      this.obtenerProfesores();
    });
    this.obtenerProfesores();
  }

  obtenerProfesores() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: PeriodicElement[]) => {
        this.listaprofesores = profesores;
      },
      error => console.error('Error al obtener profesores:', error)
    );
  }


  openDialogEditar(profesor) {
    this.profesorAEditar = profesor;
    console.log(this.profesorAEditar)

    const dialogRef = this.dialog.open(ProfesorEditarModal, {
      data: { profesorAEditar: this.profesorAEditar }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEliminar(id_profesor): void {
    const dialogRef = this.dialog.open(ProfesorEliminarModal, {
      data: { ID: id_profesor }  // Pasar el ID al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'profesor-edit-modal.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class ProfesorEditarModal {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProfesorEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private ProfesoresService: ProfesoresService
  ) {
    this.form = new FormGroup({
      'id_profesor': new FormControl(this.data.profesorAEditar.id_profesor),
      'nombre': new FormControl(this.data.profesorAEditar.nombre),
      'apellido': new FormControl(this.data.profesorAEditar.apellido),
      'email': new FormControl(this.data.profesorAEditar.email)
    });
  }

  guardarCambios() {
    const profesor = this.form.value;
    this.http.put(`http://localhost:8080/api/profesores/${profesor.id_profesor}`, profesor, { responseType: 'text' }).subscribe(
      () => {
        console.log('Profesor actualizado:', profesor.id_profesor);
        this.ProfesoresService.profesorActualizado$.next();
        this.dialogRef.close(profesor);
        this.showToast();
      },
      error => {
        console.error('Error al actualizar Profesor:', error);
        this.showToastEmail();
        this.dialogRef.close(profesor);
      }
    );
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

  showToastEmail() {
    const toast = document.getElementById('toastemail');
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
  templateUrl: 'profesor-delete-modal.component.html',
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
export class ProfesorEliminarModal {
  constructor(
    public dialogRef: MatDialogRef<ProfesorEliminarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inyectar los datos del diálogo
    private http: HttpClient,
    private ProfesoresService: ProfesoresService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminarProfesor() {
    const ID = this.data.ID;

    this.http.delete(`http://localhost:8080/api/profesores/${ID}`,).subscribe(
      () => {
        this.showToast();
        console.log('profesore eliminado:', ID);
        this.ProfesoresService.profesorActualizado$.next();
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