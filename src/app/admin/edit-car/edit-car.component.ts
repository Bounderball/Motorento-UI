import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditCarService } from 'src/app/EditCar.service';
import { ICar } from 'src/app/ICar';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css']
})
export class EditCarComponent implements OnInit { // Admin page for editing a car in the database

  editCar: ICar; // Variable to get the car whose data the admin wishes to edit

  constructor(private http: HttpClient, private router: Router, private editCarService: EditCarService, private errorService: ErrorService) {
    
    this.editCar = this.editCarService.getEditCar(); // Get the car whose data the admin wishes to edit

  }

  ngOnInit(): void {
  }

  save(): void { // Update the selected car's data in the database with the newly edited data by the admin

    if (this.editCar.modelId == null || this.editCar.mileage == null || this.editCar.licensePlateNumber == "" || this.editCar.branch == null) {
      alert("One or more required details are missing"); // Make sure that all the required inputs are not empty, otherwise show a message
      return;
    }

    if (this.editCar.modelId < 1) {
      alert("Model ID must be a whole number, 1 or larger"); // Make sure that the car's model ID is a whole number larger than zero, otherwise show a message
      return;
    }

    if (this.editCar.mileage < 0) {
      alert("Mileage must be 0 or larger"); // Make sure that the car's mileage is larger than zero, otherwise show a message
      return;
    }

    if (this.editCar.branch < 1) {
      alert("Branch must be a whole number, 1 or larger"); // Make sure that the car's branch ID is a whole number larger than zero, otherwise show a message
      return;
    }

    const rgx = new RegExp("^[0-9]{3,9}$"); // Regular expression for validating a proper license plate number, by making sure it consists of only between 3 and 9 digits

    if (!rgx.test(this.editCar.licensePlateNumber)) {
      alert("License plate number must consist of only between 3 and 9 digits"); // Make sure the input license plate number consists of only between 3 and 9 digits, otherwise show a message
      return;
    }

    this.http.put( // Update the selected car's data in the database with the newly edited data by the admin
      "http://localhost:26185/cars/put/" + this.editCar.id,
      this.editCar,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { console.log(error); alert(error.error.Message); },
      () => { this.back(); } // After updating the car's data, navigate back to the car management page
    );
  }

  back(): void { // Navigate back to the car management page
    this.router.navigate(["admin/manage-cars"]);
  }

}
