import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditModelService } from 'src/app/EditModel.service';
import { FormsModule } from '@angular/forms';
import { IModel } from 'src/app/IModel';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css']
})
export class EditModelComponent implements OnInit { // Admin page for editing a model in the database

  editModel: IModel; // Variable to get the model whose data the admin wishes to edit

  modelManufactureYear: string; // Variable to handle the model's manufacture year
  modelManufactureYearNumbered: number;  // Variable to get the model's manufacture year as a numeric value

  constructor(private http: HttpClient, private router: Router, private editModelService: EditModelService, private errorService: ErrorService) {
    
    this.editModel = this.editModelService.getEditModel(); // Get the model whose data the admin wishes to edit
    debugger;
    this.modelManufactureYear = "" + this.editModel.manufactureYear; // Get the model's manufacture year (in date format, with arbitrary date January 1st)
    this.modelManufactureYear = this.modelManufactureYear.substring(0, 10); // Slice from the model's manufacture year only the year month and day, without the time
    this.modelManufactureYearNumbered = parseInt(this.modelManufactureYear); // Get the model's manufacture year only, from the above string, as a numeric value

  }

  ngOnInit(): void {
  }

  save(): void { // Update the selected model's data in the database with the newly edited data by the admin

    if (this.editModel.manufacturer == "" || this.editModel.modelName == "" || this.editModel.dailyPrice == null ||
    this.editModel.delayPricePerDay == null || this.modelManufactureYearNumbered == null) {
      alert("One or more required details are missing!"); // Make sure that no required input is empty, otherwise show a message
      return;
    }

    if (this.editModel.dailyPrice < 0) {
      alert("Daily price cannot be a negative number"); // Make sure that the input daily price is not a negative number, otherwise show a message
      return;
    }

    if (this.editModel.delayPricePerDay < 0) {
      alert("Delay price per day cannot be a negative number"); // Make sure that the input delay fee is not a negative number, otherwise show a message
      return;
    }

    if (this.editModel.manufacturer.length < 2 || this.editModel.manufacturer.length > 50) {
      alert("Manufacturer name must be between 2 and 50 characters long"); // Make sure that the manufacturer name is of proper length, otherwise show a message
      return;
    }

    if (this.editModel.modelName.length < 2 || this.editModel.modelName.length > 50) {
      alert("Model name must be between 2 and 50 characters long"); // Make sure that the model name is of proper length, otherwise show a message
      return;
    }

    this.http.put( // Update the selected model's data in the database with the newly edited data by the admin
      "http://localhost:26185/models/put/" + this.editModel.id,
      {
        "manufacturer": this.editModel.manufacturer, "modelName": this.editModel.modelName, "dailyPrice": this.editModel.dailyPrice,
        "delayPricePerDay": this.editModel.delayPricePerDay, "manufactureYear": "" + this.modelManufactureYearNumbered + "-01-01", "gear": this.editModel.gear // Insert the input manufacture year as a date, with the arbitrary month and day "January 1st"
      },
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { this.errorService.showError(error); },
      () => { this.back(); } // After updating the model's data, navigate back to the model management page
    );
  }

  back(): void { // Navigate back to the user management page
    this.router.navigate(["admin/manage-models"]);
  }

}
