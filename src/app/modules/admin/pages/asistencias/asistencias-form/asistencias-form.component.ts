import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'asistencias-form',
  templateUrl: './asistencias-form.component.html',
  styleUrls: ['./asistencias-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatButtonModule],
})
export class FormsAsistenciasAdd implements OnInit {
  profesores: any[] = [];
  materiasquiero: any[] = [];
  estudiantesDeLaMateria: any[] = [];
  user: any;
  form: FormGroup;
  
  @ViewChild('ToastInsertarUSU') ToastInsertarUSU: ElementRef;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    let fechaHoraActual = new Date().toISOString();
    let fechaHoraMySQL = fechaHoraActual.slice(0, 19).replace('T', ' ');
    this.form = this.formBuilder.group({
      id_profesor: ['', Validators.required],
      id_materia: ['', Validators.required],
      id_estudiante: ['', Validators.required],
      asistio: [false, Validators.required],
      fecha: [fechaHoraMySQL, Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerProfesores();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  crearAsistencia(asistencia) {
    return this.http.post('http://localhost:8080/api/asistencias', asistencia);
  }

  registrar() {
    if (this.form.valid) {
      const asistencia = this.form.value;
      asistencia.asistio = asistencia.asistio ? 1 : 0;
      this.crearAsistencia(asistencia).subscribe(
        data => {
          console.log('Asistencia creada:', data);
  
          // Restablecer el formulario a su estado inicial
          const initialFormState = {
            id_profesor: '',
            id_materia: '',
            id_estudiante: '',
            asistio: false,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
          };
          this.form.setValue(initialFormState);
          
          // Marcar el formulario como "prístino" y "sin tocar"
          this.form.markAsPristine();
          this.form.markAsUntouched();
  
          this.showToast();
        },
        error => {
          if (error.status === 409) {
            console.error('La asistencia ya existe en la base de datos');
            this.showToastExisteEstudiante();
          } else {
            console.error('Error al crear asistencia:', error);
          }
        }
      );
    } else {
      console.error('El formulario no es válido');
      this.showToastFormularioNoValido();
    }
  }
  

  obtenerProfesores() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any[]) => {
        this.profesores = profesores;
      },
      error => console.error('Error al obtener profesores:', error)
    );
  }

  obtenerMateriasProfesor(id_profesor: number) {
    return this.http.get(`http://localhost:8080/api/materiaprofesor/porEstudiante/${id_profesor}`);
  }

  onProfesorSeleccionado(id_profesor: number) {
    if (id_profesor) {
      this.obtenerMateriasProfesor(id_profesor).subscribe(
        (materiasProfesor: any[]) => {
          this.materiasquiero = [];
          materiasProfesor.forEach(materiaProfesor => {
            let id_materia = materiaProfesor.id_materia;
            this.obtenerMateriaPorId(id_materia).subscribe(
              (materia: any) => {
                this.materiasquiero.push(materia);
              },
              error => console.error('Error al obtener la materia:', error)
            );
          });
        },
        error => console.error('Error al obtener las materias del profesor:', error)
      );
    } else {
      console.error('ID del profesor no válido');
    }
  }

  obtenerMateriaPorId(id_materia: number) {
    return this.http.get(`http://localhost:8080/api/materias/materia/${id_materia}`);
  }

  obtenerEstudiantesPorMateria(id_materia: number) {
    return this.http.get(`http://localhost:8080/api/materiaestudiante/porMateria/${id_materia}`);
  }

  onMateriaProfesorSeleccionada(id_materia: number) {
    if (id_materia) {
        this.obtenerEstudiantesPorMateria(id_materia).subscribe(
            (estudiantesMateria: any[]) => {
                this.estudiantesDeLaMateria = [];
                estudiantesMateria.forEach(estudianteMateria => {
                    let id_estudiante = estudianteMateria.id_estudiante;
                    this.obtenerEstudiantePorId(id_estudiante).subscribe(
                        (estudianteResponse: any) => {
                            // Si estudianteResponse es un array, extraemos el primer elemento
                            const estudiante = Array.isArray(estudianteResponse) ? estudianteResponse[0] : estudianteResponse;

                            // Agregar solo el objeto de estudiante a la lista
                            this.estudiantesDeLaMateria.push(estudiante);
                        },
                        error => console.error('Error al obtener el estudiante:', error)
                    );
                });
            },
            error => console.error('Error al obtener los estudiantes de la materia:', error)
        );
    } else {
        console.error('ID de la materia no válido');
    }
}




  obtenerEstudiantePorId(id_estudiante: number) {
    return this.http.get(`http://localhost:8080/api/estudiantes/porEstudiante/${id_estudiante}`);
  }

  showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }

  showToastExisteEstudiante() {
    const toast = document.getElementById('toastexiste');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }

  showToastFormularioNoValido() {
    const toast = document.getElementById('toastformulario');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 3000);
  }
}
