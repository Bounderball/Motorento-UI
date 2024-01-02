import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigatedFromCarService { // This service stores a boolean indicating whether the user has just navigated to the login page from the car rent page,
                                       // or just from any other page. Affects whether upon logging in the user will be redirected to the home page or to the car rent page
  navigatedFromCarSubject: Subject<boolean> = new Subject<boolean>();
  navigatedFromCar: boolean;

  constructor() {
  }

  setNavigatedFromCar(navigatedFromCar: boolean): void {
    this.navigatedFromCarSubject.next(navigatedFromCar);
    this.navigatedFromCar = navigatedFromCar;
  }

  getNavigatedFromCar(): boolean {
    return this.navigatedFromCar;
  }

}
