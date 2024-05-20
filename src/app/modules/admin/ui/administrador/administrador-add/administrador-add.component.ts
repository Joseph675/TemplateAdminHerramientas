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
    selector: 'administrador-add',
    templateUrl: './administrador-add.component.html',
    styleUrls: ['./administrador.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],
})
export class FormsAdministradorAdd implements OnInit {

    form: FormGroup;
    @ViewChild('ToastInsertarUSU') ToastInsertarUSU: ElementRef;


    constructor(private http: HttpClient,private _formBuilder: UntypedFormBuilder) {
        this.form = this._formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            avatar: [''],
            rol: ['administrador']
        });
    }
    

    crearAdministrador(administrador) {
        return this.http.post('http://localhost:8080/api/administradores', administrador);
    }


    registrar() {
        if (this.form.valid) {
            const administrador = this.form.value;
            
            this.crearAdministrador(administrador).subscribe(
                data => {
                    console.log('Administrador creado:', data);
                    this.form.reset();
                    this.showToast();
                },
                error => {
                    if (error.status === 409) {
                        console.error('El administrador ya existe en la base de datos');
                        this.showToastExisteEstudiante();
                    } else {
                        console.error('Error al crear administrador:', error);
                    }
                }
            );
        } else {
            console.error('El formulario no es válido');
            this.showToastFormularioNoValido();

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

    ngOnInit(): void {
    }
}
