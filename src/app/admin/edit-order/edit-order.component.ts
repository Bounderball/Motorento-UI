import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditOrderService } from 'src/app/EditOrder.service';
import { FormsModule } from '@angular/forms';
import { IOrder } from 'src/app/IOrder';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit { // Admin page for editing an order in the database

  editOrder: IOrder; // Variable to get the order whose data the admin wishes to edit

  // string variables for handling date input fields:
  startDateString: string;
  endDateString: string;
  dateReturnedString: string;

  constructor(private http: HttpClient, private router: Router, private editOrderService: EditOrderService, private errorService: ErrorService) {
    
    this.editOrder = this.editOrderService.getEditOrder(); // Get the order whose data the admin wishes to edit
    
    this.startDateString = this.editOrder.startDate.toString().substring(0, 10); // Import the default rent date value from the previous screen
    this.endDateString = this.editOrder.endDate.toString().substring(0, 10); // Import the default return date value from the previous screen
    if (this.editOrder.dateReturned != null) { // Date returned is an optional value, so if none was input - do not try to import it to edit-order screen
      this.dateReturnedString = this.editOrder.dateReturned.toString().substring(0, 10); // And if it was, import it
    }
    else {
      this.dateReturnedString = null;
    }

  }

  ngOnInit(): void {
  }

  save(): void { // Update the selected order's data in the database with the newly edited data by the admin

    if (this.editOrder.carId < 1) {
      alert("Car ID must be a whole number, 1 or larger"); // Make sure that the order's car ID is a whole number larger than zero, otherwise show a message
      return;
    }

    if (this.editOrder.carId == null || this.editOrder.userName == "") {
      alert("One or more required details are missing"); // Make sure that no required input is empty, otherwise show a message
      return;
    }

    if (new Date(this.startDateString) >= new Date(this.endDateString)) {
      alert("Return date must be at least 1 day after rent date"); // Make sure that the return date is at least one day after the rent date, otherwise show a message
      return;
    }

    if (this.dateReturnedString != null && new Date(this.dateReturnedString) < new Date(this.startDateString)) {
      alert("Date returned must be rent date or later"); // Make sure that the date returned is the same as the rent date or later, otherwise show a message
      return;
    }

    this.http.put( // Update the selected order's data in the database with the newly edited data by the admin
      "http://localhost:26185/orders/put/" + this.editOrder.id,
      {"id": this.editOrder.id, "startDate": this.startDateString, "endDate": this.endDateString, "dateReturned": this.dateReturnedString,
      "userName": this.editOrder.userName, "carId": this.editOrder.carId },
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { console.log(error); alert(error.error.Message); },
      () => { this.back(); } // After updating the user's data, navigate back to the order management page
    );
  }

  back(): void { // Navigate back to the user management page
    this.router.navigate(["admin/manage-orders"]);
  }

}
