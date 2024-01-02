import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnDateService { // This service passes order return dates between components

  returnDateSubject: Subject<string> = new Subject<string>();
  returnDate: string;

  constructor() { }

  setReturnDate(returnDate: string): void {
    this.returnDateSubject.next(returnDate);
    this.returnDate = returnDate;
  }

  getReturnDate(): string {
    return this.returnDate;
  }

}
