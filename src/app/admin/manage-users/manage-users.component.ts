import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditOrderService } from 'src/app/EditOrder.service';
import { FormsModule } from '@angular/forms';
import { IUser } from 'src/app/IUser';
import { EditUserService } from 'src/app/editUser.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit { // Admin page for viewing, adding, editing and deleting of users in the database

  users: IUser[] = []; // Local array for getting all the users and their data

  //Inputs
  userUserName: string;
  userPassword: string;
  userRole: string;
  userFirstName: string;
  userLastName: string;
  userBirthDate: string;
  userSex: boolean;
  userEmail: string;
  userPic: string;

  constructor(private http: HttpClient, private router: Router, private editUserService: EditUserService, private errorService: ErrorService) {
    this.loadUsersTable(); // Load all the users and their data from the database into the local array for viewing and managing
  }

  ngOnInit(): void {
  }

  loadUsersTable(): void { // Load all the users and their data from the database into the local array for viewing and managing

    // Initialize input values, so that the input fields will be emptied after every addition
    this.userUserName = "";
    this.userPassword = "";
    this.userRole = "user";
    this.userFirstName = "";
    this.userLastName = "";
    this.userBirthDate = "";
    this.userSex = true;
    this.userEmail = "";
    this.userPic = "";

    this.http.get("http://localhost:26185/users/get", // Load all the users and their data from the database into the local array for viewing and managing
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.users = t.body as IUser[]; },
      (error) => { console.log(error); alert(error.error.Message); },
      () => { }
    );
  }

  editUser(i: IUser): void {
    this.editUserService.setEditUser(i); // Remember the user next to which the edit link was pressed, with all its data, for editing in the edit page
    this.router.navigate(["admin/edit-user"]); // Navigate to the edit page, to edit the selected user
  }

  deleteUser(i: IUser): void { // Delete the selected user from the database
    this.http.delete("http://localhost:26185/users/delete/" + i.userName,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { console.log(error); alert(error.error.Message); },
      () => { alert("User deleted successfuly"); this.loadUsersTable(); } // After deleting the user, display a message and refresh the user list
    );
  }

  addUser(): void { // Create a new user in the database, with the new input information

    if (this.userUserName == "" || this.userPassword == "" || this.userFirstName == "" || this.userLastName == "" || this.userEmail == "") {
      alert("One or more required details are missing!"); // Make sure no required details are missing, and display a message otherwise
      return;
    }

    if (this.userUserName.length < 6 || this.userUserName.length > 50) { // Make sure the user name length is proper, and display a message otherwise
      alert("User name must be between 6 and 50 characters long");
      return;
    }

    if (this.userPassword.length < 6 || this.userPassword.length > 50) { // Make sure the password length is proper, and display a message otherwise
      alert("Password must be between 6 and 50 characters long");
      return;
    }

    if (this.userFirstName.length < 2 || this.userFirstName.length > 50) { // Make sure the first name length is proper, and display a message otherwise
      alert("First name must be between 2 and 50 characters long");
      return;
    }

    if (this.userLastName.length < 2 || this.userLastName.length > 50) { // Make sure the last name length is proper, and display a message otherwise
      alert("Last name must be between 2 and 50 characters long");
      return;
    }

    const rgx = new RegExp(".+@.+\..+"); // Regular expression for validating a proper email address

    if (!rgx.test(this.userEmail)) {
      alert("Please enter a valid email address"); // Make sure the input email address is valid, and display a message otherwise
      return;
    }

    this.http.post("http://localhost:26185/users/register", // Add the new user in the database with all the input data
      {
        "userName": this.userUserName, "password": this.userPassword, "role": this.userRole, "firstName": this.userFirstName,
        "lastName": this.userLastName, "birthDate": this.userBirthDate, "sex": this.userSex, "email": this.userEmail, "pic": this.userPic
      },
      { "observe": "response", "headers": localStorage }).subscribe(
        () => { },
        (error) => { console.log(error); alert(error.error.Message); },
        () => { alert("User added successfully"); this.loadUsersTable(); } // After creating the new user, display a message and refresh the user list
      );
  }

}
