import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuariosEliminados = new Subject<void>();
  usuarioActualizado$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get usuariosEliminados$() {
    return this.usuariosEliminados.asObservable();
  }

  usuarioEliminado() {
    this.usuariosEliminados.next();
  }

  signIn(credentials) {
    return this.http.post('/api/login', credentials);
  }
}
