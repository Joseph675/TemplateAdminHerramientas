import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { catchError, Observable, of, switchMap, throwError, map } from 'rxjs';


@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [MatSelectModule,RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
    ) {
    }


    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            userType: ['', Validators.required]
        });
    }

    email: string;
    password: string;
    signIn(event: Event): void {
        // Prevent the default form submit action
        event.preventDefault();
    
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }
    
        // Disable the form
        this.signInForm.disable();
    
        // Hide the alert
        this.showAlert = false;
    
        // Get the selected user type
        const userType = this.signInForm.value.userType;
    
        // Sign in
        let signInObservable: Observable<any>;
        if (userType === 'admin') {
            signInObservable = this._authService.signInAdmin(this.signInForm.value);
        } else if (userType === 'profesor') {
            signInObservable = this._authService.signInProfesor(this.signInForm.value);
        } else if (userType === 'estudiante') {
            signInObservable = this._authService.signInEstudiante(this.signInForm.value);
        } else {
            throw new Error('Tipo de usuario no válido');
        }
    
        signInObservable.subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    
                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();
    
                // Reset the form
                this.signInNgForm.resetForm();
    
                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };
    
                // Show the alert
                this.showAlert = true;
            },
        );
    }
    
}
