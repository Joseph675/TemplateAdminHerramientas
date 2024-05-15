import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

showToastEditar = new EventEmitter<void>();
showToastEmail = new EventEmitter<void>();
showToastEliminar = new EventEmitter<void>();



showEditar() {
    this.showToastEditar.emit();
}

showEmail() {
  this.showToastEmail.emit();
}

showEliminar() {
  this.showToastEliminar.emit();
}

}
