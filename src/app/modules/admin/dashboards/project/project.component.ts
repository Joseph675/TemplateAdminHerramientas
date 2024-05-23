import { CurrencyPipe, NgClass, NgFor, NgIf, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    HttpClientModule,
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    NgFor,
    NgIf,
    MatTableModule,
    NgClass,
    CurrencyPipe
  ],
})
export class ProjectComponent implements OnInit, OnDestroy {
  user: any;
  dataSource;
  singleEstudiantes: any[] = [];
  singleMaterias: any[] = [];
  singleFechas: any[] = [];
  estudiantes: any = {};
  materias: any = {};
  view: [number, number] = [400, 300];

  private _contador = new BehaviorSubject<number>(0);
  private _contadorestu = new BehaviorSubject<number>(0);
  private _contadorprofe = new BehaviorSubject<number>(0);
  private _contadormate = new BehaviorSubject<number>(0);
  private _contadorasis = new BehaviorSubject<number>(0);

  contador$ = this._contador.asObservable();
  contadorestu$ = this._contadorestu.asObservable();
  contadorprofe$ = this._contadorprofe.asObservable();
  contadormate$ = this._contadormate.asObservable();
  contadorasis$ = this._contadorasis.asObservable();

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  explodeSlices: boolean = false;
  doughnut: boolean = false;
  gradient: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private http: HttpClient,
    private _projectService: ProjectService,
    private _router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSelect(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {
    // Implementa el método de limpieza según sea necesario
  }

  ngOnInit(): void {
    this.obtenerAdministradores();
    this.obtenerEstudiantes();
    this.obtenerProfesores();
    this.obtenerMaterias();
    this.obtenerasistencias();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  obtenerAdministradores() {
    this.http.get('http://localhost:8080/api/administradores').subscribe(
      (administradores: any) => {
        let i = 0;
        do {
          let administrador = administradores[i];
          i++;
        } while (i < administradores.length);
        this._contador.next(i);
        console.log('Contador de administradores:', i);
      },
      error => console.error('Error al obtener administradores:', error)
    );
  }

  obtenerEstudiantes() {
    this.http.get('http://localhost:8080/api/estudiantes').subscribe(
      (estudiantes: any[]) => {
        for (let i = 0; i < estudiantes.length; i++) {
          let estudiante = estudiantes[i];
          this.estudiantes[estudiante.id_estudiante] = estudiante.nombre + ' ' + estudiante.apellido;
        }
        this._contadorestu.next(estudiantes.length);
        console.log('Contador de estudiantes:', estudiantes.length);
        console.log('Estudiantes:', this.estudiantes);
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }

  obtenerProfesores() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any) => {
        let i = 0;
        do {
          let profesor = profesores[i];
          i++;
        } while (i < profesores.length);
        this._contadorprofe.next(i);
        console.log('Contador de profesores:', i);
      },
      error => console.error('Error al obtener profesores:', error)
    );
  }

  obtenerMaterias() {
    this.http.get('http://localhost:8080/api/materias').subscribe(
      (materias: any[]) => {
        for (let i = 0; i < materias.length; i++) {
          let materia = materias[i];
          this.materias[materia.idMateria] = materia.nombreMateria;
        }
        this._contadormate.next(materias.length);
        console.log('Contador de materias:', materias.length);
        console.log('Materias:', this.materias);
      },
      error => console.error('Error al obtener materias:', error)
    );
  }

  obtenerasistencias() {
    this.http.get('http://localhost:8080/api/asistencias').subscribe(
      (asistencias: any[]) => {
        console.log('Respuesta de la API:', asistencias); // Verificar la respuesta completa
        if (asistencias.length > 0) {
            console.log('Ejemplo de elemento de la API:', asistencias[0]); // Verificar la estructura de un solo elemento
        }

        let asistenciaCountsEstudiantes = {};
        let asistenciaCountsMaterias = {};
        let asistenciaCountsFechas = {};

        asistencias.forEach((asistencia: any) => {
          if (asistencia.asistio === '1') {
            // Contar por estudiantes
            const nombreEstudiante = this.estudiantes[asistencia.id_estudiante] || `Estudiante ${asistencia.id_estudiante}`;
            asistenciaCountsEstudiantes[nombreEstudiante] = 
              (asistenciaCountsEstudiantes[nombreEstudiante] || 0) + 1;
            // Contar por materias
            const nombreMateria = this.materias[asistencia.id_materia] || `Materia ${asistencia.id_materia}`;
            asistenciaCountsMaterias[nombreMateria] = 
              (asistenciaCountsMaterias[nombreMateria] || 0) + 1;
            // Contar por fechas
            asistenciaCountsFechas[asistencia.fecha] = 
              (asistenciaCountsFechas[asistencia.fecha] || 0) + 1;
          }
        });

        this.singleEstudiantes = Object.keys(asistenciaCountsEstudiantes).map(key => ({
          name: key,
          value: asistenciaCountsEstudiantes[key]
        }));

        this.singleMaterias = Object.keys(asistenciaCountsMaterias).map(key => ({
          name: key,
          value: asistenciaCountsMaterias[key]
        }));

        this.singleFechas = Object.keys(asistenciaCountsFechas).map(key => ({
          name: key,
          value: asistenciaCountsFechas[key]
        }));

        console.log('Datos para el gráfico de estudiantes:', this.singleEstudiantes); 
        console.log('Datos para el gráfico de materias:', this.singleMaterias); 
        console.log('Datos para el gráfico de fechas:', this.singleFechas); 

        this._contadorasis.next(this.singleEstudiantes.length);
        this.cdr.detectChanges(); // Forzar la detección de cambios
        console.log('Contador de asistencias:', this.singleEstudiantes.length);
      },
      error => console.error('Error al obtener asistencias:', error)
    );
  }
}
