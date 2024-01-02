import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ICar } from './ICar';

@Injectable({
  providedIn: 'root'
})
export class EditCarService { // This service passes a chosen car's data from manage-car page to edit-car page, for when the admin clicks "edit" next to a car

  editCarSubject: Subject<ICar> = new Subject<ICar>();
  editCar: ICar;

  constructor() { }

  setEditCar(editCar: ICar): void {
    this.editCarSubject.next(editCar);
    this.editCar = editCar;
  }

  getEditCar(): ICar {
    return this.editCar;
  }

}
