import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentDateService { // This service passes order rent dates between components

  rentDateSubject: Subject<string> = new Subject<string>();
  rentDate: string;

  constructor() { }

  setRentDate(rentDate: string): void {
    this.rentDateSubject.next(rentDate);
    this.rentDate = rentDate;
  }

  getRentDate(): string {
    return this.rentDate;
  }

}
