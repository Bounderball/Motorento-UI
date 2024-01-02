import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRoleService } from './UserRole.service';
import { Router } from '@angular/router';
import { UserNameService } from './UserName.service';
import { IWorkingCar } from './IWorkingCar';
import { NavigatedFromCarService } from './NavigatedFromCar.service';
import { ErrorService } from './Error.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService { // This service includes all angular login functionality for this web application

  constructor(private http: HttpClient, private userRole: UserRoleService, private errorService: ErrorService,
    private router: Router, private userName: UserNameService, private navigatedFromCar: NavigatedFromCarService) { }

  login(inputUserName: string, inputPassword: string): void {
    this.http.post("http://localhost:26185/users/login",
      { "userName": inputUserName, "password": inputPassword },
      { "observe": "response" })
      .subscribe(
        (t) => {
          localStorage.Authorization = "Bearer " + (t as any).body.token1;
          let currentUserRole: string = (t as any).body.userDetails1.role;
          this.userRole.setUserRole(currentUserRole);
          this.userName.setUserName(inputUserName);
          if (this.navigatedFromCar.getNavigatedFromCar()) {
            this.router.navigate(["user/rent"]);
          }
          else {
            this.router.navigate([currentUserRole]);
          }
        },
        (error) => { alert(error.error.Message); }
      );
  }

}
