import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditOrderService } from 'src/app/EditOrder.service';
import { FormsModule } from '@angular/forms';
import { IModel } from 'src/app/IModel';
import { EditModelService } from 'src/app/EditModel.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.css']
})
export class ManageModelsComponent implements OnInit { // Admin page for viewing, adding, editing and deleting of models in the database

  models: IModel[] = []; // Local array for getting all the models and their data

  //Inputs
  modelManufacturer: String;
  modelModelName: String;
  modelDailyPrice: number;
  modelDelayPricePerDay: number;
  modelManufactureYear: number;
  modelGear: Boolean;

  constructor(private http: HttpClient, private router: Router, private editModelService: EditModelService, private errorService: ErrorService) {
    this.loadModelsTable(); // Load all the models and their data from the database into the local array for viewing and managing
  }

  ngOnInit(): void {
  }

  loadModelsTable(): void { // Load all the models and their data from the database into the local array for viewing and managing

  // Initialize input values, so that the input fields will be emptied after every addition
  this.modelManufacturer = "";
  this.modelModelName = "";
  this.modelDailyPrice = null;
  this.modelDelayPricePerDay = null;
  this.modelManufactureYear = null;
  this.modelGear = true;

    this.http.get("http://localhost:26185/models/get", // Load all the models and their data from the database into the local array for viewing and managing
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.models = t.body as IModel[]; },
      (error) => { alert(error.error.Message); },
      () => { }
    );
  }

  editModel(i: IModel): void {
    this.editModelService.setEditModel(i); // Remember the models next to which the edit link was pressed, with all its data, for editing in the edit page
    this.router.navigate(["admin/edit-model"]); // Navigate to the edit page, to edit the selected model
  }

  deleteModel(i: IModel): void { // Delete the selected model from the database
    this.http.delete("http://localhost:26185/models/delete/" + i.id,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { alert(error.error.Message); },
      () => { alert("Model deleted successfuly"); this.loadModelsTable(); } // After deleting the model, display a message and refresh the model list
    );
  }

  addModel(): void { // Create a new model in the database, with the new input information

    if (this.modelManufacturer == "" || this.modelModelName == "" || this.modelDailyPrice == null ||
    this.modelDelayPricePerDay == null || this.modelManufactureYear == null) {
      alert("One or more required details are missing!"); // Make sure no required input is empty, and show a message otherwise
      return;
    }

    if (this.modelDailyPrice < 0) {
      alert("Daily price cannot be a negative number"); // Make sure that the input daily price is not a negative number, and show a message otherwise
      return;
    }

    if (this.modelDelayPricePerDay < 0) {
      alert("Delay price per day cannot be a negative number"); // Make sure that the input delay fee is not a negative number, and show a message otherwise
      return;
    }

    if (this.modelManufacturer.length < 2 || this.modelManufacturer.length > 50) {
      alert("Manufacturer name must be between 2 and 50 characters long"); // Make sure that the input manufacturer name is of proper length, and show a message otherwise
      return;
    }

    if (this.modelModelName.length < 2 || this.modelModelName.length > 50) {
      alert("Model name must be between 2 and 50 characters long"); // Make sure that the input model name is of proper length, and show a message otherwise
      return;
    }

    this.http.post("http://localhost:26185/models/post", // Add the new model in the database with all the input data
      { "manufacturer": this.modelManufacturer, "modelName": this.modelModelName, "dailyPrice": this.modelDailyPrice,
      "delayPricePerDay": this.modelDelayPricePerDay , "manufactureYear": "" + this.modelManufactureYear + "-01-01", "gear": this.modelGear }, // From the date input designated for the model's manufacture year, set the month and day arbitrarily to January 1st
      { "observe": "response", "headers": localStorage }).subscribe(
        () => { },
        (error) => { alert(error.error.errors[Object.keys(error.error.errors)[0]][0]); },
        () => { alert("Model added successfully"); this.loadModelsTable(); } // After creating the new model, display a message and refresh the user list
      );
  }

}
