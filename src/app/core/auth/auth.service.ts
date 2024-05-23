import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError, map, } from 'rxjs';

interface ServerResponse {
    token: string;
    id: number;
    avatar: string;
    nombre: string;
    email: string;
    rol: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signInAdmin(credentials: { email: string; password: string }): Observable<any> {
        return this.signIn(credentials, 'http://localhost:8080/api/administradores/login');
    }
    
    signInEstudiante(credentials: { email: string; password: string }): Observable<any> {
        return this.signIn(credentials, 'http://localhost:8080/api/estudiantes/login');
    }
    
    signInProfesor(credentials: { email: string; password: string }): Observable<any> {
        return this.signIn(credentials, 'http://localhost:8080/api/profesores/login');
    }
    
    private signIn(credentials: { email: string; password: string }, url: string): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
    
        return this._httpClient.post<ServerResponse>(url, credentials).pipe(
            map(response => {
                // Imprimir la respuesta en la consola
                console.log(response);
    
                // Store the access token in the local storage
                this.accessToken = response.token;
    
                // Set the authenticated flag to true
                this._authenticated = true;
    
                const user = {
                    id: response.id,
                    avatar: response.avatar,
                    name: response.nombre,
                    email: response.email,
                    rol: response.rol
                };
                console.log(user)
    
                
    
                // Store the user in the local storage
                localStorage.setItem('user', JSON.stringify(user));
    
                console.log(this._userService.user)
    
                // Return the successful response
                return response;
            }),
            catchError(error => {
                console.error(error);
                return of({ error: 'Login failed.' });
            })
        );
    }
    






    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) => {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}