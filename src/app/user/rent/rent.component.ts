import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkingCar } from 'src/app/IWorkingCar';
import { ChosenCarService } from 'src/app/ChosenCar.service';
import { GearEnum } from 'src/enums/gearEnum';
import { FormsModule } from '@angular/forms';
import { UserRoleService } from 'src/app/UserRole.service';
import { UserNameService } from 'src/app/UserName.service';
import { NavigatedFromCarService } from 'src/app/NavigatedFromCar.service';
import { DateDifferenceService } from 'src/app/DateDifference.service';
import { RentDateService } from 'src/app/RentDate.service';
import { ReturnDateService } from 'src/app/ReturnDate.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit {

  currentChosenCar: IWorkingCar; // Variable for getting the relevant car's data

  // Inputs
  currentUserRole: string = "";
  currentUserName: string = "";
  rentDateString: string = "";
  returnDateString: string = "";

  // Variables to store today's and tomorrow's dates, to enforce logical rent date and return date validations
  today: string = new Date(Date.now()).toISOString().substring(0, 10);
  tomorrow: string = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().substring(0, 10);

  constructor(private http: HttpClient, private router: Router, private chosenCar: ChosenCarService, private errorService: ErrorService,
    private userRole: UserRoleService, private userName: UserNameService, private navigatedFromCar: NavigatedFromCarService,
    private dateDifference: DateDifferenceService, private rentDateService: RentDateService, private returnDateService: ReturnDateService) {

    this.currentChosenCar = this.chosenCar.getChosenCar(); // Get the chosen car's data
    this.currentUserRole = this.userRole.getUserRole(); // Get the current connected user's role
    this.currentUserName = this.userName.getUserName(); // Get the current connected user's user-name
    this.rentDateString = this.rentDateService.getRentDate().toString().substring(0, 10); // Get the rent date previously typed in the catalog page
    this.returnDateString = this.returnDateService.getReturnDate().toString().substring(0, 10); // Get the returned date prevously typed in the catalog page

  }

  ngOnInit(): void {

  }


  getProjectedRentCost(): number { // Calculate the projected cost of the rent, multiplying the number of days by the car model's daily price
    let rentPeriodDurationInDays: number;
    rentPeriodDurationInDays = this.dateDifference.getNumberOfDaysBetweenTwoDates(this.rentDateString, this.returnDateString); // Get rent period length in days
    if (rentPeriodDurationInDays <= 0) { return 0; } // Return a price of zero if the duration happens to turn out 0 or smaller

    let projectedCost: number = rentPeriodDurationInDays * this.currentChosenCar.dailyPrice; // Calculate projected rent cost, multiplying the number of days by the car model's daily price
    return projectedCost;
  }

  navigate(destination: string): void { // Function used to navigate between different components in the web application
    this.router.navigate(["user/" + destination]);
  }

  goToLogin(): void { // Navigate to login page, and remember to navigate back to this page after login
    this.navigatedFromCar.setNavigatedFromCar(true);
    this.navigate('login');
  }

  order(): void { // Make order

    if (new Date(this.rentDateString) < new Date(this.today)) { // If the user tries to set the start date to before the current date,
      this.rentDateString = this.today;
      alert("Rent date must be today or later"); // Display this message and stop
      return;
    }

    if (new Date(this.returnDateString) < new Date(this.tomorrow)) { // If the user tries to set the return date to today or earlier,
      this.returnDateString = this.tomorrow;
      alert("Return date must be tomorrow or later"); // Display this message and stop
      return;
    }

    if (new Date(this.returnDateString) <= new Date(this.rentDateString)) { // If the user tries to set return date to be the same as the rent date, or before it,
      alert("Return date must be at least 1 day after rent date"); // Display this message and stop
      return;
    }

    this.http.post( // Create new order in the database
      "http://localhost:26185/orders/post",
      { "startDate": this.rentDateString, "endDate": this.returnDateString, "userName": this.currentUserName, "carId": this.currentChosenCar.id },
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { },
      (error) => { this.errorService.showError(error); },
      () => { alert("Your order is in!"); }
    );
  }

}
