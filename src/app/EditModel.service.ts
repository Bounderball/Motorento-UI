import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IModel } from './IModel';

@Injectable({
  providedIn: 'root'
})
export class EditModelService { // This service passes a chosen model's data from manage-model page to edit-model page, for when the admin clicks "edit" next to a model

  editModelSubject: Subject<IModel> = new Subject<IModel>();
  editModel: IModel;

  constructor() { }

  setEditModel(editModel: IModel): void {
    this.editModelSubject.next(editModel);
    this.editModel = editModel;
  }

  getEditModel(): IModel {
    return this.editModel;
  }

}
