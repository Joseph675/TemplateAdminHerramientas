import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';


import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

interface PeriodicElement {
  id_profesor: number;
  nombreProfesor: string;
  CorreoElectronico: string;
  Rol: string;
  Acciones: string;
}

@Component({
  selector: 'activities-estudiantes',
  templateUrl: './activities.component.html',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule, MatPaginatorModule],

})
export class TableActivities implements OnInit {
  dataSource: MatTableDataSource<PeriodicElement>;
  actividades: PeriodicElement[] = [];
  profesores = [];
  id
  profesoresMap: any = {}; // Mapa de id_profesor a nombre

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerProfesor();

  }

  obtenerActividades() {
    this.http.get<PeriodicElement[]>('http://localhost:8080/api/actividades').subscribe(
      (actividades: PeriodicElement[]) => {
        // Ahora tienes las actividades
        this.actividades = actividades.map(actividad => {
          // Obtener el nombre del profesor usando el mapa
          actividad.nombreProfesor = this.profesoresMap[actividad.id_profesor];
          console.log(actividad.id_profesor)
          return actividad;
        });
        this.dataSource = new MatTableDataSource(actividades);
        this.dataSource.paginator = this.paginator;
        console.log(this.actividades)
      },
      error => console.error('Error al obtener actividades:', error)
    );
  }

  obtenerProfesor() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any[]) => {
        // Crear un mapa de id_profesor a nombre
        profesores.forEach(profesor => {
          let id_profesor = profesor.id_profesor;
          let nombre = profesor.nombre + ' ' + profesor.apellido;
          this.profesoresMap[id_profesor] = nombre;
          console.log(nombre)
          this.obtenerActividades();

        });
      },
      error => console.error('Error al obtener profesores:', error)
    );
  }

  trackByFn(index, item) {
    return item.ID;
  }
}
