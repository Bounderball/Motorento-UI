import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainNavigationOptions } from 'src/enums/mainNavigationOptionsEnum';
import { UserRoleService } from './UserRole.service';
import { UserNameService } from './UserName.service';
import { NavigatedFromCarService } from './NavigatedFromCar.service';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUserRole: string = "";
  currentUserName: string = "";

  constructor(private http: HttpClient, private router: Router, private userRole: UserRoleService,
    private userName: UserNameService, private navigatedFromCar: NavigatedFromCarService, private errorService: ErrorService) {

    this.userRole.userRoleSubject.subscribe( // Keep track of the current logged-in user's role
      (t) => { this.currentUserRole = t; },
      (error) => { this.errorService.showError(error); }
    );

    this.userName.userNameSubject.subscribe( // Keep track of the current logged-in user's user-name
      (t) => { this.currentUserName = t },
      (error) => { this.errorService.showError(error); }
    );

  }

  ngOnInit() {
  }

  navigate(chosenNavigationOption: MainNavigationOptions): void { // Navigate to different sections in the web application, upon clicking login/register/logout/history

    switch (chosenNavigationOption) {
      case MainNavigationOptions.login:
        this.navigatedFromCar.setNavigatedFromCar(false); // Remember the user did not navigate to the login page from the car rent page, so upon login the user will be redirected back to here
        this.router.navigate(['user/login']);
        break;
      case MainNavigationOptions.register:
        this.router.navigate(['user/register']);
        break;
      case MainNavigationOptions.logout:
        localStorage.Authorization = " ";
        this.userRole.setUserRole(""); // Empty the user role from memory
        this.userName.setUserName(""); // Empty the user name from memory
        this.router.navigate(['user/home']);
        break;
      case MainNavigationOptions.history:
        this.router.navigate(['user/history']);
        break;
    }

  }

}
