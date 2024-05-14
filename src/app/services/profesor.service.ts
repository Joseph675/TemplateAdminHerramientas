import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private ProfesoresEliminados = new Subject<void>();

  get ProfesoresEliminados$() {
    return this.ProfesoresEliminados.asObservable();
  }

  profesorEliminado() {
    this.ProfesoresEliminados.next();
  }

  profesorActualizado$ = new Subject<void>();
}
