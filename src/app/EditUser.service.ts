import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser } from './IUser';

@Injectable({
  providedIn: 'root'
})
export class EditUserService { // This service passes a chosen user's data from manage-user page to edit-user page, for when the admin clicks "edit" next to a user

  editUserSubject: Subject<IUser> = new Subject<IUser>();
  editUser: IUser;

  constructor() { }

  setEditUser(editUser: IUser): void {
    this.editUserSubject.next(editUser);
    this.editUser = editUser;
  }

  getEditUser(): IUser {
    return this.editUser;
  }

}
