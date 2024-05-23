import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';



export interface Estudiante {
  id_estudiante: number;
  id_materia: number;
  dias: string;
  hora: string;

}

export interface Materia {
  id_materia: number;
}

@Component({
  selector: 'materias_por_estudiante-add',
  templateUrl: './materias_por_estudiante-add.component.html',
  styleUrls: ['./materias_por_estudiante.component.scss'],
  standalone: true,
  imports: [NgxMaterialTimepickerModule, NgxMatTimepickerModule, MatSelectModule, CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule]
})


export class Formsmaterias_por_estudiante implements OnInit {
  estudiantes: Estudiante[];
  materias: Materia[];




  form: FormGroup;
  @ViewChild('ToastInsertarUSU') ToastInsertarUSU: ElementRef;




  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {
    this.form = this._formBuilder.group({
      id_estudiante: ['', Validators.required],
      id_materia: ['', Validators.required],
      dias: ['', Validators.required],
      hora: ['', Validators.required],

    });
  }


  ngOnInit() {
    this.obtenerEstudiantes();
    this.obtenerMaterias();

  }

  obtenerEstudiantes() {
    this.http.get<Estudiante[]>('http://localhost:8080/api/estudiantes').subscribe(
      estudiantes => {
        this.estudiantes = estudiantes;
      },
      error => console.error('Error al obtener estudiantes:', error)
    );
  }

  obtenerMaterias() {
    this.http.get<Materia[]>('http://localhost:8080/api/materias').subscribe(
      materias => {
        this.materias = materias;
        console.log(materias)

      },
      error => console.error('Error al obtener materias:', error)
    );
  }


  registrar() {
    if (this.form.valid) {
      const data = this.form.value;
      // Función para convertir la hora a formato de 24 horas
      function convertTo24Hour(time) {
        var elements = time.split(':');
        var hours = elements[0];
        var minutes = elements[1];
        var ampm = elements[1].substr(-2);
        if (ampm == 'PM' && hours != '12') {
          hours = parseInt(hours) + 12;
        } else if (ampm == 'AM' && hours == '12') {
          hours = '00';
        }
        return `${hours}:${minutes.substr(0, 2)}`;

      }

      // Convertir la hora a formato de 24 horas
      data.hora = convertTo24Hour(data.hora);

      console.log(data)

      this.http.post('http://localhost:8080/api/materiaestudiante', data)
        .subscribe(
          response => {
            // Aquí puedes manejar la respuesta de tu API
            // Por ejemplo, puedes mostrar un mensaje de éxito
            this.showToast();
            this.form.reset();

          },
          error => {
            console.error(error);
            this.showToastExisteRegistro();

            // Aquí puedes manejar los errores
            // Por ejemplo, puedes mostrar un mensaje de error
          }
        );
    } else {
      console.log('Formulario no válido');
      this.showToastFormularioNoValido();

      // Aquí puedes manejar el caso en que el formulario no sea válido
      // Por ejemplo, puedes mostrar un mensaje de error
    }
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

  showToastFormularioNoValido() {
    const toast = document.getElementById('toastformulario');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    }, 3000);
}

showToastExisteRegistro() {
    const toast = document.getElementById('toastexiste');
    toast.classList.remove('hide');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    }, 3000);
}


}