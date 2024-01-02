import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWorkingCar } from './IWorkingCar';

@Injectable({
  providedIn: 'root'
})
export class ChosenCarService { // This service passes the data of the car clicked on by the user from the catalog to the car's rent page,
                                // and from the car's rent page to the login page in case of navigating to the login page from there, so that the user will be redirected back to the same car's rent page
  chosenCarSubject: Subject<IWorkingCar> = new Subject<IWorkingCar>();
  chosenCar: IWorkingCar;

  constructor() {

  }

  setChosenCar(chosenCar: IWorkingCar): void {
    this.chosenCarSubject.next(chosenCar);
    this.chosenCar = chosenCar;
  }

  getChosenCar(): IWorkingCar {
    return this.chosenCar;
  }

}
