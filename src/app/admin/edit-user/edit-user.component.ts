import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditUserService } from 'src/app/editUser.service';
import { IUser } from 'src/app/IUser';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit { // Admin page for editing a user in the database

  editUser: IUser; // Variable to get the user whose data the admin wishes to edit

  birthDateString: string; // Variable to handle the user's birth date

  constructor(private http: HttpClient, private router: Router, private editUserService: EditUserService, private errorService: ErrorService) {

    this.editUser = this.editUserService.getEditUser(); // Get the user whose data the admin wishes to edit

    if (this.birthDateString != null) { // Birth-date is an optional input option, so if no birth-date was input - do not try to import it to edit-user screen
      this.birthDateString = this.editUser.birthDate.toString().substring(0, 10); // And if it was, import it
    }

  }

  ngOnInit(): void {
  }

  save(): void { // Update the selected user's data in the database with the newly edited data by the admin

    if (this.editUser.password == "" || this.editUser.firstName == "" || this.editUser.lastName == "" || this.editUser.email == "") {
      alert("One or more required details are missing!"); // Make sure that all the required inputs are not empty, otherwise show a message
      return;
    }

    if (this.editUser.password.length < 6 || this.editUser.password.length > 50) {
      alert("Password must be between 6 and 50 characters long"); // Make sure that the input password is of proper length, otherwise show a message
      return;
    }

    if (this.editUser.firstName.length < 2 || this.editUser.firstName.length > 50) {
      alert("First name must be between 2 and 50 characters long"); // Make sure that the input first name is of proper length, otherwise show a message
      return;
    }

    if (this.editUser.lastName.length < 2 || this.editUser.lastName.length > 50) {
      alert("Last name must be between 2 and 50 characters long"); // Make sure that the input last name is of proper length, otherwise show a message
      return;
    }

    const rgx = new RegExp(".+@.+\..+"); // Regular expression for validating a proper email address

    if (!rgx.test(this.editUser.email)) {
      alert("Please enter a valid email address"); // Make sure the input email address is valid, and display a message otherwise
      return;
    }

    this.http.put(
      "http://localhost:26185/users/put", // Update the selected user's data in the database with the newly edited data by the admin
      {
        "userName": this.editUser.userName, "password": this.editUser.password, "role": this.editUser.role, "firstName": this.editUser.firstName,
        "lastName": this.editUser.lastName, "birthDate": this.birthDateString, "sex": this.editUser.sex,
        "email": this.editUser.email, "pic": this.editUser.pic
      },
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { this.errorService.showError(error); },
      () => { this.back(); } // After updating the user's data, navigate back to the user management page
    );
  }

  back(): void { // Navigate back to the user management page
    this.router.navigate(["admin/manage-users"]);
  }

}
