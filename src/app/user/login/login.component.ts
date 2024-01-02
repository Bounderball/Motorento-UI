import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Login.service';
import { IWorkingCar } from 'src/app/IWorkingCar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // This is the login page, where users, employees and admins can log into the system

  loggingInMessage: boolean = false; // Boolean variable used to show and hide a "logging in" message on screen
  inputUserName: string = ""; // User name variable for the input
  inputPassword: string = ""; // Password variable for the input

  constructor(private router: Router, private loginService: LoginService) {

  }

  ngOnInit(): void {

  }

  login(): void { // Perform login
    
    if (this.inputUserName.length < 6) { alert("User name must be at least 6 characters long"); return; } // Ensure user name is not too short
    if (this.inputUserName.length > 50) { alert("User name must be at most 50 characters long"); return; } // Ensure user name is not too long
    if (this.inputPassword.length < 6) { alert("Password must be at least 6 characters long"); return; } // Ensure password is not too short
    if (this.inputPassword.length > 50) { alert("Password must be at most 50 characters long"); return; } // Ensure password is not too long

    this.loggingInMessage = true; // Show "logging in" message
    this.loginService.login(this.inputUserName, this.inputPassword); // Perform login, using the login service
    this.loggingInMessage = false; // hide "logging in" message (necessary in case of login failure)
  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate(["user/" + destination]);
  }


}
