import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService { // This service passes user roles between components

  userRole: string;
  userRoleSubject: Subject<string> = new Subject<string>();

  constructor() {

  }

  setUserRole(role: string): void {
    this.userRoleSubject.next(role);
    this.userRole = role;
  }

  getUserRole(): string {
    return this.userRole;
  }

}
