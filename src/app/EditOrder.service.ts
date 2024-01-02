import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IOrder } from './IOrder';

@Injectable({
  providedIn: 'root'
})
export class EditOrderService { // This service passes a chosen order's data from manage-order page to edit-order page, for when the admin clicks "edit" next to a order

  editOrderSubject: Subject<IOrder> = new Subject<IOrder>();
  editOrder: IOrder;

  constructor() { }

  setEditOrder(editOrder: IOrder): void {
    this.editOrderSubject.next(editOrder);
    this.editOrder = editOrder;
  }

  getEditOrder(): IOrder {
    return this.editOrder;
  }


}
