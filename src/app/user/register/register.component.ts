import { Component, OnInit } from '@angular/core';
import { Sex } from 'src/enums/sexEnum';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserRoleService } from 'src/app/UserRole.service';
import { LoginService } from 'src/app/Login.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit { // This is the register page, for registering as a new user. One cannot register himself from this page as an employee or admin


  // Inputs
  inputUserName: string = "";
  inputPassword: string = "";
  inputFirstName: string = "";
  inputLastName: string = "";
  inputSex: Sex = Sex.male;
  inputEmail: string = "";
  inputBirthDate: string = "1990-01-01";
  inputPic: string = "";

  constructor(private http: HttpClient, private router: Router, private userRole: UserRoleService,
    private loginService: LoginService, private errorService: ErrorService) {

    }

  ngOnInit(): void {
  }

  register(): void { // Register new user in the database

    if (this.inputUserName == "" || this.inputPassword == "" || this.inputFirstName == "" || this.inputLastName == "" || this.inputEmail == "") { // If any of these fields is empty,
      alert("One or more required details are missing"); // throw an error
      return;
    }

    if (this.inputUserName.length < 6 || this.inputUserName.length > 50) { // If user name is not of proper length,
      alert("User name must be between 6 and 50 characters long"); // throw an error
      return;
    }

    if (this.inputPassword.length < 6 || this.inputPassword.length > 50) { // If password is not of proper length,
      alert("Password must be between 6 and 50 characters long"); // throw an error
      return;
    }

    if (this.inputFirstName.length < 2 || this.inputFirstName.length > 50) { // If the input first name is not of proper length,
      alert("First name must be between 2 and 50 characters long"); // throw an error
      return;
    }

    if (this.inputLastName.length < 2 || this.inputLastName.length > 50) { // If the input last name is not of proper length,
      alert("Last name must be between 2 and 50 characters long"); // throw an error
      return;
    }



    this.http.post( // Add the new user to the database
      "http://localhost:26185/users/register",
      {
        "role": "user", "userName": this.inputUserName, "password": this.inputPassword, "firstName": this.inputFirstName, "lastName": this.inputLastName,
        "birthDate": this.inputBirthDate, "sex": (this.inputSex == Sex.male ? true : false), "email": this.inputEmail, "pic": this.inputPic
      },
      { "observe": "response" }
    ).subscribe(
      () => { },
      (error) => { alert(error.error.errors[Object.keys(error.error.errors)[0]][0]); },
      // (error) => { this.errorService.showError(error as HttpErrorResponse); },
      () => { this.loginService.login(this.inputUserName, this.inputPassword); }
    );
  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate(["user/" + destination]);
  }

}
