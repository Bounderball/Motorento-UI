import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateDifferenceService } from 'src/app/DateDifference.service';
import { ErrorService } from 'src/app/error.service';
import { IHistoryOrder } from 'src/app/IHistoryOrder';
import { IModel } from 'src/app/IModel';
import { IOrder } from 'src/app/IOrder';
import { UserNameService } from 'src/app/UserName.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit { // This page shows a user their order history

  historyOrders: IHistoryOrder[]; // Array for getting all the user's orders with all relevant data

  constructor(private router: Router, private http: HttpClient, private dateDifference: DateDifferenceService,
    private userName: UserNameService, private errorService: ErrorService) {
    this.loadHistoryOrders(); // Load orders and their relevant data from the database into the local array
  }

  ngOnInit(): void {

  }

  loadHistoryOrders(): void { // Load orders and their relevant data from the database into the local array
    this.http.get(
      "http://localhost:26185/orders/gethistoryordersbyusername/" + this.userName.getUserName(),
      { "observe": "response", "headers": localStorage }
    ).subscribe(
      (t) => { this.historyOrders = (t.body as IHistoryOrder[]) },
      (error) => { this.errorService.showError(error); }
    );
  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate(["user/" + destination]);
  }

}
