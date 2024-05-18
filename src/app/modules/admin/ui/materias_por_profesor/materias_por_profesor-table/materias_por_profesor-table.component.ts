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
  selector: 'materias_por_profesor-table',
  styleUrl: 'materias_por_profesor-table.component.scss',
  templateUrl: 'materias_por_profesor-table.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule, MatPaginatorModule],
})
export class Tablematerias_por_profesor implements OnInit {

  displayedColumns: string[] = ['ID', 'Nombre', 'Materias', 'Acciones'];
  dataSource;
  profesores = [];
  materias: any = {};
  profesorAEditar = null;
  @ViewChild('miModal') miModal: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private EstudiantesService: EstudiantesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.EstudiantesService.estudianteActualizado$.subscribe(() => {
      this.obtenerMateriasEstudiantes();
    });
    this.obtenerProfesor();
    this.obtenerMaterias();
    this.obtenerMateriasEstudiantes();
  }

  obtenerMateriasEstudiantes() {
    this.http.get('http://localhost:8080/api/materiaprofesor').subscribe(
      (materiaprofesor: any[]) => {
        let profesoresMaterias = {};
        for (let i = 0; i < materiaprofesor.length; i++) {
          let me = materiaprofesor[i];
          let nombreProfesor =  this.profesores[me.id_profesor];
          let nombreMateria = this.materias[me.id_materia];
          if (!profesoresMaterias[me.id_profesor]) {
            profesoresMaterias[me.id_profesor] = { nombre: nombreProfesor, materias: new Set([nombreMateria]), id: me.id };
          } else {
            profesoresMaterias[me.id_profesor].materias.add(nombreMateria);
          }
        }
        let profesoresMateriasArray = [];
        for (let id_profesor in profesoresMaterias) {
          profesoresMateriasArray.push({ nombre: profesoresMaterias[id_profesor].nombre, materias: Array.from(profesoresMaterias[id_profesor].materias).join(', '), id: profesoresMaterias[id_profesor].id, id_profesor: id_profesor });
        }
        this.dataSource = new MatTableDataSource(profesoresMateriasArray);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('Error al obtener materiaprofesor:', error)
    );
  }

  obtenerProfesor() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any[]) => {
        for (let i = 0; i < profesores.length; i++) {
          let profesor = profesores[i];
          this.profesores[profesor.id_profesor] = profesor.nombre + ' ' + profesor.apellido;
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


  openDialogEstudiante(profesor) {
    this.profesorAEditar = profesor;
    const dialogRef = this.dialog.open(ProfesorEditarModal, {
      data: { profesorAEditar: this.profesorAEditar }
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
  templateUrl: 'materias_por_profesor-edit-modal.component.html',
  standalone: true,
  imports: [MatSelectModule,CommonModule,MatPaginatorModule, MatIconModule, MatTableModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class ProfesorEditarModal {
  form: FormGroup;
  datasource;
  profesores = [];
  materias: any = {};
  displayedColumns: string[] = ['nombre', 'materia', 'hora', 'dias', 'Acciones'];
  materiaprofesores: any;
  materiaprofesoresFormGroups: any;
  constructor(public dialogRef: MatDialogRef<ProfesorEditarModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private EstudiantesService: EstudiantesService
  ) {
    this.materiaprofesoresFormGroups = [];
    this.materiaprofesores = [];
  }

  ngOnInit() {
    this.obtenerProfesor();
    this.obtenerMaterias();
    this.obtenerMateriasEstudiantes(this.data.profesorAEditar.id_profesor);
  }


  obtenerMateriasEstudiantes(id_profesor) {
    this.http.get('http://localhost:8080/api/materiaprofesor/porEstudiante/' + id_profesor).subscribe(
      (materiaprofesor: any[]) => {
        this.materiaprofesores = materiaprofesor;
        let profesoresMateriasArray = [];
        this.materiaprofesoresFormGroups = []; // Asegúrate de inicializar el array
        for (let i = 0; i < materiaprofesor.length; i++) {
          let me = materiaprofesor[i];
          let nombreProfesor = this.profesores[me.id_profesor];
          let nombreMateria = this.materias[me.id_materia];
          profesoresMateriasArray.push({ nombre: nombreProfesor, materias: nombreMateria, id: me.id, id_profesor: me.id_profesor, hora: me.hora, dias: me.dias });
  
          // Crea un nuevo FormGroup para este estudiante y añádelo al array
          let formGroup = new FormGroup({
            dias: new FormControl(me.dias),
            hora: new FormControl(me.hora.slice(0, 5))
          });
          this.materiaprofesoresFormGroups.push(formGroup);
        console.log(this.materiaprofesoresFormGroups)
      }
        this.datasource = profesoresMateriasArray;

        console.log(this.datasource)
      },
      error => console.error('Error al obtener materiaprofesor:', error)
    );
  }
  


  obtenerProfesor() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any[]) => {
        for (let i = 0; i < profesores.length; i++) {
          let profesor = profesores[i];
          this.profesores[profesor.id_profesor] = profesor.nombre + ' ' + profesor.apellido;
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

  eliminarProfesor() {
    const ID = this.data.profesorAEditar.id;
    this.http.delete(`http://localhost:8080/api/materiaprofesor/${ID}`,).subscribe(
      () => {
        console.log('Profesor eliminado:', ID);
        this.obtenerMateriasEstudiantes(this.data.profesorAEditar.id_profesor);
        this.EstudiantesService.estudianteActualizado$.next();

        this.dialogRef.close();
        this.showToastEliminar();


      },
      error => console.error('Error al eliminar Estudiante:', error)
    );
  }

  guardarCambios() {
    if (this.materiaprofesores) {
      for (let i = 0; i < this.materiaprofesores.length; i++) {
        let materiaprofesor = this.materiaprofesores[i];
        let formGroup = this.materiaprofesoresFormGroups[i];
        console.log('Cambios para ' + materiaprofesor.nombre + ':', formGroup.value);
  
        // Actualiza el estudiante en el servidor
        let materiaActualizado = {
          ...materiaprofesor,
          dias: formGroup.value.dias,
          hora: formGroup.value.hora
        };

        console.log(materiaActualizado)
  
        this.http.put(`http://localhost:8080/api/materiaprofesor/${materiaActualizado.id}`, materiaActualizado, { responseType: 'text' }).subscribe(
          () => {
            console.log('Estudiante actualizado:', materiaActualizado.id);
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



