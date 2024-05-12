import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private EstudiantesEliminados = new Subject<void>();

  get EstudiantesEliminados$() {
    return this.EstudiantesEliminados.asObservable();
  }

  estudianteEliminado() {
    this.EstudiantesEliminados.next();
  }

  estudianteActualizado$ = new Subject<void>();
}
