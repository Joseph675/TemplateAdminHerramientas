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
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Asegúrate de importar HttpHeaders
import { FormGroup, FormBuilder } from '@angular/forms';



@Component({
    selector: 'materias-add',
    templateUrl: './materia-add.component.html',
    styleUrls: ['./materia.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],
})
export class FormsMateriaAdd implements OnInit {

    form: FormGroup;
    @ViewChild('ToastInsertarUSU') ToastInsertarUSU: ElementRef;


    constructor(private http: HttpClient,private _formBuilder: UntypedFormBuilder) {
        this.form = this._formBuilder.group({
            nombre_materia: ['']
        });
    }
    

    crearMateria(materia) {
        return this.http.post('http://localhost:8080/api/materias', materia);
    }


    registrar() {
        const materia = this.form.value;
        console.log(materia);
        this.crearMateria(materia).subscribe(
            data => {
                console.log('materia creado:', data);
                this.form.reset();
                this.showToast();
            },
            error => console.error('Error al crear materia:', error)
        );
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

    ngOnInit(): void {
       


    }
}
