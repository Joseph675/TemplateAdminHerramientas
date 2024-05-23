import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'activityForm',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],

})
export class FormsActividadesAdd implements OnInit {

  dataSource;
  profesores = [];
  materiasProfesor = [];
  materias: any = {};
  materiasquiero: any[] = [];


  form: FormGroup;
  @ViewChild('ToastInsertarUSU') ToastInsertarUSU: ElementRef;
  constructor(private http: HttpClient, private _formBuilder: UntypedFormBuilder) {
    let fechaHoraActual = new Date().toISOString();
    // Convertir la fecha a un formato que MySQL pueda entender
    let fechaHoraMySQL = fechaHoraActual.slice(0, 19).replace('T', ' ');
    this.form = this._formBuilder.group({
      id_profesor: ['', Validators.required],
      id_materia: ['', Validators.required],
      titulo: ['', Validators.required],
      detalles_actividad: ['', Validators.required],
      fecha_hora_creacion: [fechaHoraMySQL, Validators.required],
    });
}


  ngOnInit(): void {
    this.obtenerProfesor();

  }



  crearActividad(actividad) {
    return this.http.post('http://localhost:8080/api/actividades', actividad);
  }


  registrar() {
    if (this.form.valid) {
      const actividad = this.form.value;

      this.crearActividad(actividad).subscribe(
        data => {
          console.log('actividad creado:', data);
          this.form.reset();
          this.showToast();
        },
        error => {
          if (error.status === 409) {
            console.error('El actividad ya existe en la base de datos');
            this.showToastExisteEstudiante();
          } else {
            console.error('Error al crear actividad:', error);
          }
        }
      );
    } else {
      console.error('El formulario no es válido');
      this.showToastFormularioNoValido();

    }
  }


  obtenerProfesor() {
    this.http.get('http://localhost:8080/api/profesores').subscribe(
      (profesores: any[]) => {
        this.profesores = profesores.map(profesor => {
          let id_profesor = profesor.id_profesor;
          let nombre = profesor.nombre + ' ' + profesor.apellido;

          return {
            id: id_profesor,
            nombre: nombre
          };
        });
      },
      error => console.error('Error al obtener profesores:', error)
    );
  }

  obtenerMateriasProfesor(id_profesor: number) {
    return this.http.get(`http://localhost:8080/api/materiaprofesor/porEstudiante/${id_profesor}`);
  }

  
  onProfesorSeleccionado(id_profesor: number) {
    this.obtenerMateriasProfesor(id_profesor).subscribe(
        (materiasProfesor: any[]) => {
            // Ahora tienes las materias del profesor
            this.materiasProfesor = materiasProfesor.map(materiaProfesor => {
                let id_materia = materiaProfesor.id_materia;

                // Obtener el nombre de la materia
                this.obtenerMateriaPorId(id_materia).subscribe(
                    (materia: any) => {
                        // Agrega la materia al array materiasquiero
                        this.materiasquiero.push(materia);
                        console.log(this.materiasquiero)
                    },
                    error => console.error('Error al obtener la materia:', error)
                );

                return materiaProfesor;
            });
        },
        error => console.error('Error al obtener las materias del profesor:', error)
    );
}



  obtenerMateriaPorId(id_materia: number) {
    return this.http.get(`http://localhost:8080/api/materias/materia/${id_materia}`);
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
