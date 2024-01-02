import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditOrderService } from 'src/app/EditOrder.service';
import { FormsModule } from '@angular/forms';
import { ICar } from 'src/app/ICar';
import { EditCarService } from 'src/app/EditCar.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-manage-cars',
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css']
})
export class ManageCarsComponent implements OnInit { // Admin page for viewing, adding, editing and deleting of cars in the database

  cars: ICar[] = [];

  //Inputs
  carModelId: number;
  carMileage: number;
  carPic: string;
  carInWorkingOrder: boolean;
  carLicensePlateNumber: string;
  carBranch: number;

  constructor(private http: HttpClient, private router: Router, private editCarService: EditCarService, private errorService: ErrorService) {
    this.loadCarsTable(); // Load all the cars and their data from the database into the local array for viewing and managing
  }

  ngOnInit(): void {
  }

  loadCarsTable(): void { // Load all the cars and their data from the database into the local array for viewing and managing

    // Initialize input values, so that the input fields will be emptied after every addition
    this.carModelId = null;
    this.carMileage = null;
    this.carPic = "";
    this.carInWorkingOrder = true;
    this.carLicensePlateNumber = null;
    this.carBranch = null;

    this.http.get("http://localhost:26185/cars/get", // Load all the cars and their data from the database into the local array for viewing and managing
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.cars = t.body as ICar[]; },
      (error) => { this.errorService.showError(error); },
      () => { }
    );
  }

  editCar(i: ICar): void {
    this.editCarService.setEditCar(i); // Remember the car next to which the edit link was pressed, with all its data, for editing in the edit page
    this.router.navigate(["admin/edit-car"]); // Navigate to the edit page, to edit the selected car
  }

  deleteCar(i: ICar): void { // Delete the selected car from the database
    this.http.delete("http://localhost:26185/cars/delete/" + i.id,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { alert(error.error.Message); },
      () => { alert("car deleted successfuly"); this.loadCarsTable(); } // After deleting the car, display a message and refresh the car list
    );
  }

  addCar(): void { // Create a new car in the database, with the new input information

    if (this.carModelId == null || this.carMileage == null || this.carLicensePlateNumber == null || this.carBranch == null) {
      alert("One or more required details are missing!");
      return;
    }

    if (this.carModelId < 1) {
      alert("Model ID must be a whole number, 1 or larger"); // Make sure that the input car's ID is a whole number larger than zero, otherwise show a message
      return;
    }

    if (this.carMileage < 0) {
      alert("Mileage must be 0 or larger"); // Make sure that the input car's mileage is 0 or larger, otherwise show a message
      return;
    }

    if (this.carBranch < 1) {
      alert("Branch ID must be a whole number, 1 or larger"); // Make sure that the input car's branch ID is a whole number larger than zero, otherwise show a message
      return;
    }

    const rgx = new RegExp("^[0-9]{3,9}$"); // Regular expression used to validate a proper license plate number, by making sure it consists of only between 3 and 9 digits

    if (!rgx.test(this.carLicensePlateNumber)) {
      alert("License plate number must consist of only between 3 and 9 digits"); // Make sure the license plate number consists of only between 3 and 9 digits, and show a message otherwise
      return;
    }

    this.http.post("http://localhost:26185/cars/post", // Add the new car in the database with all the input data
      {
        "modelId": this.carModelId, "mileage": this.carMileage, "pic": this.carPic, "inWorkingOrder": this.carInWorkingOrder,
        "licensePlateNumber": this.carLicensePlateNumber, "branch": this.carBranch
      },
      { "observe": "response", "headers": localStorage }).subscribe(
        () => { },
        (error) => { console.log(error); alert(error.error.Message); },
        () => { alert("car added successfully"); this.loadCarsTable(); } // After creating the new user, display a message and refresh the car list
      );
  }

}
