import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserNameService { // This service passes user names between components

  userNameSubject: Subject<string> = new Subject<string>();
  userName: string;

  constructor() {
    
  }

  setUserName(userName: string): void {
    this.userNameSubject.next(userName);
    this.userName = userName;
  }

  getUserName(): string {
    return this.userName;
  }

}
