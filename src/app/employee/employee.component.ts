import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DateDifferenceService } from '../DateDifference.service';
import { IOrder } from '../IOrder';
import { Router } from '@angular/router';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit { // This page allows an employee to type in a license plate number of a car and return it back to the company from being rented

  inputLicensePlateNumber: string; // Variable for receiving a license plate number from the input
  displayDelayCost: number = 0; // Variable for containing the calculated extra cost in case the car has been returned later than agreed upon renting
  displayTotalCost: number = 0; // Variable for containing the calculated total cost of the rent after the car has been returned (including delay fee)

  constructor(private http: HttpClient, private dateDifference: DateDifferenceService, private router: Router, private errorService: ErrorService) {

  }

  ngOnInit(): void {

  }

  returnCar(): void { // Perform procedure of returning a car from being rented

    if (this.inputLicensePlateNumber == null || this.inputLicensePlateNumber == "") { // Make sure the license plate number input is not empty
      alert("Please input a license plate number"); // Throw an error otherwise
      return;
    }

    const rgx = new RegExp("^[0-9]{3,9}$"); // Regular expression allowing only between 3 and 9 digits

    if (!rgx.test(this.inputLicensePlateNumber)) { // Make sure the input license plate number consists of only between 3 and 9 digits
      alert("License plate number must consist of only between 3 and 9 digits"); // Throw an error otherwise
      return;
    }

    this.displayDelayCost = 0; // Initialize cost display, in case of several returns in the same session
    this.displayTotalCost = 0;

    this.http.put( // Update in the database that the ordered car has been returned today
      "http://localhost:26185/orders/return/",
      { "licensePlateNumber": this.inputLicensePlateNumber },
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.displayCost(t.body as IOrder); },
      (error) => { alert(error.error.Message); },
      () => { alert("Car returned!"); }
    );
  }

  displayCost(endedOrder: IOrder) { // Calculate the penalty cost for a delayed car return, and the total rent cost in any case
    
    let returnedCarModel: any = {}; // Variable for getting the order's car model, for the purpose of getting that model's rent and delay costs

    this.http.get( // Get the order's car model from the database
      "http://localhost:26185/orders/getmodelfromorder/" + endedOrder.id,
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => {
        returnedCarModel = (t.body as any);
      },
      (error) => { this.errorService.showError(error); },
      () => {

        let dailyPrice: number = returnedCarModel.dailyPrice; // Get the daily rent price for the car model
        let delayPrice: number = returnedCarModel.delayPricePerDay; // Get the delay fee price for the car model
        let originalCost: number = this.dateDifference.getNumberOfDaysBetweenTwoDates(endedOrder.startDate, endedOrder.endDate) * dailyPrice; // Calculate the entire rent period's cost, NOT including delays
        let totalCost = originalCost; // Put that value in the total cost calculation
        let delayCost: number = 0; // Initialize variable for calculation of delay fees

        if (endedOrder.dateReturned > endedOrder.endDate) { // If the car was returned later than agreed upon renting,
          delayCost = this.dateDifference.getNumberOfDaysBetweenTwoDates(endedOrder.endDate, endedOrder.dateReturned) * delayPrice; // calculate the extra delay fees,
          totalCost += delayCost; // and add them to the total rent cost calculation
        }

        this.displayDelayCost = delayCost; // Display the delay fees
        this.displayTotalCost = totalCost; // Display the total rent cost, including delay fees

      }
    );
  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate([destination]);
  }

}
