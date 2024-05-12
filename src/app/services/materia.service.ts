import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private MateriasEliminados = new Subject<void>();

  get MateriasEliminados$() {
    return this.MateriasEliminados.asObservable();
  }

  materiaEliminado() {
    this.MateriasEliminados.next();
  }

  materiaActualizado$ = new Subject<void>();
}
