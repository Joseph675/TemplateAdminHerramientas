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
  ID: number;
  Nombre: string;
  CorreoElectronico: string;
  Rol: string;
  Acciones: string;
}

@Component({
  selector: 'activities-estudiantes',
  templateUrl: './activities.component.html',
  standalone: true,
  imports: [CommonModule,MatMenuModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule, MatPaginatorModule],

})
export class TableActivities implements OnInit {
    dataSource: MatTableDataSource<PeriodicElement>;
    estudiantes: PeriodicElement[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerEstudiantes();
  }

  obtenerEstudiantes() {
    this.http.get<PeriodicElement[]>('http://localhost:8080/api/estudiantes').subscribe(
      (estudiantes: PeriodicElement[]) => {
        this.estudiantes = estudiantes;
        this.dataSource = new MatTableDataSource(estudiantes);
        this.dataSource.paginator = this.paginator;
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }

  trackByFn(index, item) {
    return item.ID;
  }
}
