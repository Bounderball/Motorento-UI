import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditOrderService } from 'src/app/EditOrder.service';
import { ErrorService } from 'src/app/error.service';
import { IOrder } from 'src/app/IOrder';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit { // Admin page for viewing, adding, editing and deleting of orders in the database

  orders: IOrder[] = []; // Local array for getting all the orders and their data

  //Inputs
  orderStartDate: string;
  orderEndDate: string;
  orderDateReturned: string;
  orderUserName: string;
  orderCarId: number;

  constructor(private http: HttpClient, private router: Router, private editOrderService: EditOrderService, private errorService: ErrorService) {
    this.loadOrdersTable(); // Load all the orders and their data from the database into the local array for viewing and managing
  }

  ngOnInit(): void {
  }

  loadOrdersTable(): void { // Load all the orders and their data from the database into the local array for viewing and managing

    // Initialize input values, so that the input fields will be emptied after every addition
    this.orderStartDate = "";
    this.orderEndDate = "";
    this.orderDateReturned = "";
    this.orderUserName = "";
    this.orderCarId = null;

    this.http.get("http://localhost:26185/orders/get", // Load all the orders and their data from the database into the local array for viewing and managing
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.orders = t.body as IOrder[]; },
      (error) => { this.errorService.showError(error); }
    );
    this.orderStartDate = null;
    this.orderEndDate = null;
    this.orderDateReturned = null;
    this.orderUserName = "";
    this.orderCarId = null;
  }

  editOrder(i: IOrder): void {
    this.editOrderService.setEditOrder(i); // Remember the order next to which the edit link was pressed, with all its data, for editing in the edit page
    this.router.navigate(["admin/edit-order"]); // Navigate to the edit page, to edit the selected order
  }

  deleteOrder(i: IOrder): void { // Delete the selected order from the database
    this.http.delete("http://localhost:26185/orders/delete/" + i.id,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      () => { },
      (error) => { this.errorService.showError(error); },
      () => { alert("Order deleted successfuly"); this.loadOrdersTable(); } // After deleting the order, display a message and refresh the order list
    );
  }

  addOrder(): void { // Create a new order in the database, with the new input information

    if (this.orderCarId < 1) {
      alert("Car ID must be a whole number, 1 or larger"); // Make sure the car ID is a whole number larger than 0, and show a message otherwise
      return;
    }

    if (this.orderStartDate == null || this.orderEndDate == null || this.orderUserName == "" || this.orderCarId == null) {
      alert("One or more required details are missing!"); // Make sure no requried input is empty, and show a message otherwise
      return;
    }

    if (new Date(this.orderStartDate) >= new Date(this.orderEndDate)) {
      alert("Return date must be at least 1 day after rent date"); // Make sure the order's return date is at least one day after rent date, and show a message otherwise
      return;
    }

    if (this.orderDateReturned != null && new Date(this.orderDateReturned) < new Date(this.orderStartDate)) {
      alert("Date returned must be rent date or later"); // Make sure the date returned is no sooner than the agreed rent date, and show a message otherwise
      return;
    }
    
    if (this.orderDateReturned == null){ // Add order to database without the optional value "Date returned"
      this.http.post("http://localhost:26185/orders/post",
      { "startDate": this.orderStartDate, "endDate": this.orderEndDate, "userName": this.orderUserName, "carId": this.orderCarId },
      { "observe": "response", "headers": localStorage }).subscribe(
        () => { },
        (error) => { alert(error.error.Message); },
        () => { alert("Order added successfully"); this.loadOrdersTable(); }
      );
      return;
    }

    this.http.post("http://localhost:26185/orders/post", // Add order to database including "Date returned"
      { "startDate": this.orderStartDate, "endDate": this.orderEndDate, "dateReturned": this.orderDateReturned, "userName": this.orderUserName, "carId": this.orderCarId },
      { "observe": "response", "headers": localStorage }).subscribe(
        () => { },
        (error) => { alert(error.error.Message); },
        () => { alert("Order added successfully"); this.loadOrdersTable(); }
      );
  }
}
