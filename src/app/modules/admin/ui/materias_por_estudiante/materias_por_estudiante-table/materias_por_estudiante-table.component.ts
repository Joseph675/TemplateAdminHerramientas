import { NgModule, Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { EstudiantesService } from '../../../../../services/estudiante.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'materias_por_estudiante-table',
  styleUrl: 'materias_por_estudiante-table.component.scss',
  templateUrl: 'materias_por_estudiante-table.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule, MatPaginatorModule],
})
export class Tablematerias_por_estudiante implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'Materias', 'Acciones'];
  dataSource;
  estudiantes = [];
  materias: any = {};
  estudianteAEditar = null;
  @ViewChild('miModal') miModal: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private EstudiantesService: EstudiantesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.EstudiantesService.estudianteActualizado$.subscribe(() => {
      this.obtenerMateriasEstudiantes();
    });
    this.obtenerEstudiantes();
    this.obtenerMaterias();
    this.obtenerMateriasEstudiantes();
  }

  obtenerMateriasEstudiantes() {
    this.http.get('http://localhost:8080/api/materiaestudiante').subscribe(
      (materiaestudiante: any[]) => {
        let estudiantesMaterias = {};
        for (let i = 0; i < materiaestudiante.length; i++) {
          let me = materiaestudiante[i];
          let nombreEstudiante = this.estudiantes[me.id_estudiante];
          let nombreMateria = this.materias[me.id_materia];
          if (!estudiantesMaterias[me.id_estudiante]) {
            estudiantesMaterias[me.id_estudiante] = { nombre: nombreEstudiante, materias: new Set([nombreMateria]), id: me.id };
          } else {
            estudiantesMaterias[me.id_estudiante].materias.add(nombreMateria);
          }
        }
        let estudiantesMateriasArray = [];
        for (let id_estudiante in estudiantesMaterias) {
          estudiantesMateriasArray.push({ nombre: estudiantesMaterias[id_estudiante].nombre, materias: Array.from(estudiantesMaterias[id_estudiante].materias).join(', '), id: estudiantesMaterias[id_estudiante].id, id_estudiante: id_estudiante });
        }
        this.dataSource = new MatTableDataSource(estudiantesMateriasArray);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('Error al obtener materiaestudiante:', error)
    );
  }

  obtenerEstudiantes() {
    this.http.get('http://localhost:8080/api/estudiantes').subscribe(
      (estudiantes: any[]) => {
        for (let i = 0; i < estudiantes.length; i++) {
          let estudiante = estudiantes[i];
          this.estudiantes[estudiante.id_estudiante] = estudiante.nombre + ' ' + estudiante.apellido;

        }
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }

  obtenerMaterias() {
    this.http.get('http://localhost:8080/api/materias').subscribe(
      (materias: any[]) => {
        for (let i = 0; i < materias.length; i++) {
          let materia = materias[i];
          this.materias[materia.idMateria] = materia.nombreMateria;
        }
      },
      error => console.error('Error al obtener materias:', error)
    );
  }


  openDialogEstudiante(estudiante) {
    this.estudianteAEditar = estudiante;

    const dialogRef = this.dialog.open(EstudianteEditarModal, {
      data: { estudianteAEditar: this.estudianteAEditar }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.obtenerMateriasEstudiantes();
    });
  }


}


export interface PeriodicElement {
  ID: number;
  Nombre: string;
  CorreoElectronico: string;
  Rol: string;
  Acciones: string;
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'materias_por_estudiante-edit-modal.component.html',
  standalone: true,
  imports: [MatSelectModule,CommonModule,MatPaginatorModule, MatIconModule, MatTableModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class EstudianteEditarModal {
  form: FormGroup;
  datasource;
  estudiantes = [];
  materias: any = {};
  displayedColumns: string[] = ['nombre', 'materia', 'hora', 'dias', 'Acciones'];
  materiaestudiantes: any;
  materiaestudiantesFormGroups: any;
  constructor(public dialogRef: MatDialogRef<EstudianteEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private EstudiantesService: EstudiantesService
  ) {
    this.materiaestudiantesFormGroups = [];
    this.materiaestudiantes = [];
  }

  ngOnInit() {
    this.obtenerEstudiantes();
    this.obtenerMaterias();
    this.obtenerMateriasEstudiantes(this.data.estudianteAEditar.id_estudiante);
  }


  obtenerMateriasEstudiantes(id_estudiante) {
    this.http.get('http://localhost:8080/api/materiaestudiante/porEstudiante/' + id_estudiante).subscribe(
      (materiaestudiante: any[]) => {
        this.materiaestudiantes = materiaestudiante;
        let estudiantesMateriasArray = [];
        this.materiaestudiantesFormGroups = []; // Asegúrate de inicializar el array
        for (let i = 0; i < materiaestudiante.length; i++) {
          let me = materiaestudiante[i];
          let nombreEstudiante = this.estudiantes[me.id_estudiante];
          let nombreMateria = this.materias[me.id_materia];
          estudiantesMateriasArray.push({ nombre: nombreEstudiante, materias: nombreMateria, id: me.id, id_estudiante: me.id_estudiante, hora: me.hora, dias: me.dias });
  
          // Crea un nuevo FormGroup para este estudiante y añádelo al array
          let formGroup = new FormGroup({
            dias: new FormControl(me.dias),
            hora: new FormControl(me.hora.slice(0, 5))
          });
          this.materiaestudiantesFormGroups.push(formGroup);
          console.log(this.materiaestudiantesFormGroups)
        }
        this.datasource = estudiantesMateriasArray;
        
      },
      error => console.error('Error al obtener materiaestudiante:', error)
    );
  }
  


  obtenerEstudiantes() {
    this.http.get('http://localhost:8080/api/estudiantes').subscribe(
      (estudiantes: any[]) => {
        for (let i = 0; i < estudiantes.length; i++) {
          let estudiante = estudiantes[i];
          this.estudiantes[estudiante.id_estudiante] = estudiante.nombre + ' ' + estudiante.apellido;
        }
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }

  obtenerMaterias() {
    this.http.get('http://localhost:8080/api/materias').subscribe(
      (materias: any[]) => {
        for (let i = 0; i < materias.length; i++) {
          let materia = materias[i];
          this.materias[materia.idMateria] = materia.nombreMateria;
        }
      },
      error => console.error('Error al obtener materias:', error)
    );
  }

  eliminarEstudiante() {
    const ID = this.data.estudianteAEditar.id;
    this.http.delete(`http://localhost:8080/api/materiaestudiante/${ID}`,).subscribe(
      () => {
        console.log('Estudiante eliminado:', ID);
        this.EstudiantesService.estudianteEliminado();
        this.obtenerMateriasEstudiantes(this.data.estudianteAEditar.id_estudiante);
        this.dialogRef.close();
        this.showToastEliminar();


      },
      error => console.error('Error al eliminar Estudiante:', error)
    );
  }

  guardarCambios() {
    if (this.materiaestudiantes) {
      for (let i = 0; i < this.materiaestudiantes.length; i++) {
        let materiaestudiante = this.materiaestudiantes[i];
        let formGroup = this.materiaestudiantesFormGroups[i];
        console.log('Cambios para ' + materiaestudiante.nombre + ':', formGroup.value);
  
        // Actualiza el estudiante en el servidor
        let estudianteActualizado = {
          ...materiaestudiante,
          dias: formGroup.value.dias,
          hora: formGroup.value.hora
        };

        console.log(estudianteActualizado)
  
        this.http.put(`http://localhost:8080/api/materiaestudiante/${estudianteActualizado.id}`, estudianteActualizado, { responseType: 'text' }).subscribe(
          () => {
            console.log('Estudiante actualizado:', estudianteActualizado.id);
            this.EstudiantesService.estudianteActualizado$.next();
            this.dialogRef.close();
            this.showToastEditar();

          },
          error => {
            console.error('Error al actualizar Estudiante:', error);
          }
        );
      }
    }
  }
  
  

  showToastEliminar() {
    const toast = document.getElementById('toatsliminar');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
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



}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'materias_por_estudiante-delete-modal.component.html',
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
export class MateriaEstudiateEliminarModal {
  dataSource;

  constructor(
    public dialogRef: MatDialogRef<MateriaEstudiateEliminarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,  // Inyectar los datos del diálogo
    private http: HttpClient,
    private EstudiantesService: EstudiantesService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminarEstudiante() {
    const ID = this.data.ID;

    this.http.delete(`http://localhost:8080/api/estudiantes/${ID}`,).subscribe(
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