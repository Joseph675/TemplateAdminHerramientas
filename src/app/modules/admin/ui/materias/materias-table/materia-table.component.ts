import { Component, OnInit, ViewChild, ElementRef, Inject,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MateriasService } from '../../../../../services/materia.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';


export interface PeriodicElement {
  ID: number;
  Nombre: string;
  Editar: String;
  Eliminar: String;
}



@Component({
  selector: 'materias-table',
  styleUrl: 'materia-table.component.scss',
  templateUrl: 'materia-table.component.html',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule],
})
export class TableMateria implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'Editar', 'Eliminar'];
  dataSource;
  materias = [];
  materiaAEditar = null; // Agrega esta línea
  @ViewChild('miModal') miModal: ElementRef;
  constructor(private http: HttpClient, private MateriasService: MateriasService, public dialog: MatDialog) { }
  ngOnInit() {
    this.MateriasService.materiaActualizado$.subscribe(() => {
      this.obtenerMaterias();
    });

    this.MateriasService.materiaActualizado$.subscribe(() => {
      this.obtenerMaterias();
    });

    this.obtenerMaterias();
  }

  obtenerMaterias() {
    this.http.get('http://localhost:8080/api/materias').subscribe(
      (materias: PeriodicElement[]) => {
        this.dataSource = materias;
      },
      error => console.error('Error al obtener materias:', error)
    );
  }


  openDialogEstudiante(estudiante) {
    this.materiaAEditar = estudiante;
    const dialogRef = this.dialog.open(MateriaEditarModal, {
      data: { materiaAEditar: this.materiaAEditar } 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogEliminar(id_materia): void {
    const dialogRef = this.dialog.open(MateriaEliminarModal, {
      data: { ID: id_materia }  // Pasar el ID al diálogo
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}



@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'materia-edit-modal.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class MateriaEditarModal {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MateriaEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private MateriasService: MateriasService
  ) {
    this.form = new FormGroup({
      'id_materia': new FormControl(this.data.materiaAEditar.id_materia),
      'nombre_materia': new FormControl(this.data.materiaAEditar.nombre_materia)
    });
  }

  guardarCambios() {
    this.actualizarMateria(this.form.value).subscribe(
      () => {
        console.log('Materia actualizado:', this.form.value.id_materia);
        this.MateriasService.materiaActualizado$.next();
        this.dialogRef.close(this.form.value);
      },
      error => console.error('Error al Materia Estudiante:', error)
    );
  }


  actualizarMateria(materia) {
    return this.http.put(`http://localhost:8080/api/materias/${materia.id_materia}`, materia, { responseType: 'text' });
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
  templateUrl: 'materia-delete-modal.component.html',
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
export class MateriaEliminarModal {
  constructor(
    public dialogRef: MatDialogRef<MateriaEliminarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inyectar los datos del diálogo
    private http: HttpClient,
    private MateriasService: MateriasService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminarMateria() {
    const ID = this.data.ID;

    this.http.delete(`http://localhost:8080/api/materias/${ID}`, ).subscribe(
      () => {
        this.showToast();
        console.log('Materia eliminado:', ID);
        this.MateriasService.materiaEliminado();
      },
      error => console.error('Error al eliminar Materia:', error)
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