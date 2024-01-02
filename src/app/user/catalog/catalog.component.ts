import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IWorkingCar } from 'src/app/IWorkingCar';
import { GearPipe } from 'src/app/Gear.pipe';
import { FilterByEnum } from 'src/enums/FilterByEnum';
import { GearEnum } from 'src/enums/gearEnum';
import { Router } from '@angular/router';
import { ChosenCarService } from 'src/app/ChosenCar.service';
import { RentDateService } from 'src/app/RentDate.service';
import { ReturnDateService } from 'src/app/ReturnDate.service';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit { // This page shows the entire catalog of cars available for renting, and allows searching by different parameters and date range of availability

  workingCarsArray: Array<IWorkingCar> = []; // Local array to get all working cars with their relevant data
  filteredCarsArray: Array<IWorkingCar> = []; // Local array to get filtered results from the above array, according to the search parameters the user will input
  viewedCarsArray: Array<IWorkingCar> = []; // Local array to get cars that the user has already viewed, for the sake of showing them in the bottom panel of the screen
  carSearchString: string = ""; // Variable for user text input, used for filtering search results in the car catalog, according to the criteria the user will choose in the "chosenFilterCriterion" variable's select element
  chosenFilterCriterion: string = "freeText"; // Variable for getting the user's criterion of choice to filter search results by
  chosenGear: GearEnum = GearEnum.automatic; // Variable for getting the user's desired gear type cars to look for
  startDate: string = new Date(Date.now()).toISOString().substring(0, 10); // Variable for getting the user's desired rent date by which to look for available cars, initialized with the current date as the default value
  endDate: string = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().substring(0, 10); // Variable for getting the user's desired return date by which to look for available cars, initialized with the date after the current date as the default value
  initialStartDate: string = this.startDate; // Used to enforce minimum rent date input value to current date
  initialEndDate: string = this.endDate; // Used to enforce minimum return date input value to 1 day after current date

  constructor(private http: HttpClient, private router: Router, private chosenCar: ChosenCarService, private rentDateService: RentDateService,
    private returnDateService: ReturnDateService, private errorService: ErrorService) {
    this.http.get( // Get all working cars with their relevant data
      "http://localhost:26185/cars/getworkingcars",
      { "observe": "response" }
    ).subscribe(
      (t) => {
        this.workingCarsArray = (t.body as IWorkingCar[]);
        this.filteredCarsArray = this.workingCarsArray; // Fill "filteredCarsArray" with all the working cars, so that at first all of them will be shown with no filtering of any results until the user clicks "search"
      },
      (error) => { this.errorService.showError(error); },
      () => {
        this.initializeViewedCarsMemory(); // Makes sure a key called "viewedCars" exists in the local storage for this web application, with the purpose of containing car id's of cars the user has viewed, for the purpose of showing them in the bottom of the screen as "previously viewed cars"
        this.loadViewedCars(); // Reads the "viewedCars" key from the local storage, gets the previously shown cars' id's from there, gets those cars and adds them to the array of cars that will be shown at the bottom of the page
      }
    );

  }

  ngOnInit(): void {

  }

  initializeViewedCarsMemory(): void { // Makes sure a key called "viewedCars" exists in the local storage for this web application, with the purpose of containing car id's of cars the user has viewed, for the purpose of showing them in the bottom of the screen as "previously viewed cars"
    if (localStorage.viewedCars == null) {
      localStorage.viewedCars = "";
    }
  }

  loadViewedCars(): void { // Reads the "viewedCars" key from the local storage, gets the previously shown cars' id's from there, gets those cars and adds them to the array of cars that will be shown at the bottom of the page
    let viewedCarsIdArray: number[] = JSON.parse("[" + localStorage.viewedCars + "]");
    for (let i of viewedCarsIdArray) {
      for (let j of this.workingCarsArray) {
        if (j.id == i) {
          this.viewedCarsArray.push(j);
        }
      }
    }
  }

  filterResults(): void { // Filters the cars shown, so that only the cars matching the user's search criteria will be shown

    if (new Date(this.startDate) < new Date(this.initialStartDate)) { // Makes sure the requested rent date has not passed
      this.startDate = this.initialStartDate;
      alert("Rent date must be today or later");
      return;
    }

    if (new Date(this.endDate) < new Date(this.initialEndDate)) { // Makes sure the requested return date is not the current date or in the past
      this.endDate = this.initialEndDate;
      alert("Return date must be tomorrow or later");
      return;
    }

    if (new Date(this.startDate) >= new Date(this.endDate)) { // Makes sure the requested return date comes at least one day after the requested rent date
      alert("Return date must be at least 1 day after rent date");
      return;
    }

    this.http.get( // Add cars that are available in the requested date range, into the filtered cars array
      "http://localhost:26185/cars/getworkingcarsbydaterange/" + this.startDate + "/" + this.endDate,
      { "observe": "response" }
    ).subscribe(
      (t) => {
        this.filteredCarsArray = (t.body as IWorkingCar[]);
      },
      (error) => { this.errorService.showError(error); },
      () => {

        if ((this.carSearchString == "") && !((this.chosenFilterCriterion == "gear"))) { // If no parameter for filtering has been input, show all cars in specified date range
          return;                                                                        // (unless in "gear" mode, in which ignore the input text field's value),
        }                                                                                // and do nothing beyond.

        let filteredCarsByCriterionArray: IWorkingCar[] = [];

        switch (this.chosenFilterCriterion) { // Act differently depending on the search-by mode:
          case "freeText":
            for (let i of this.filteredCarsArray) {
              if (
                i.address.toLowerCase().includes(this.carSearchString.toLowerCase()) ||    // Into the filtered-cars array, add any car where the search string appears in either
                i.branchName.toLowerCase().includes(this.carSearchString.toLowerCase()) || // the address, branch-name, manufacturer-name or model-name
                i.manufacturer.toLowerCase().includes(this.carSearchString.toLowerCase()) ||
                i.modelName.toLowerCase().includes(this.carSearchString.toLowerCase())
              ) {
                filteredCarsByCriterionArray.push(i);
              }
            }
            break;

          case "gear":
            for (let i of this.filteredCarsArray) {
              let chosenGearBoolean: boolean = false;
              if (this.chosenGear == GearEnum.automatic) { // Add the car to the filtered-cars array if its gear (automatic/manual)
                chosenGearBoolean = true;                  // matches the chosen search value (automatic/manual)
              }
              if (i.gear == chosenGearBoolean) {
                filteredCarsByCriterionArray.push(i);
              }
            }
            break;

          case "manufacturer":
            for (let i of this.filteredCarsArray) {
              if (i.manufacturer.toLowerCase().includes(this.carSearchString.toLowerCase())) { // Add to the filtered cars array only cars that include the requested search string in their manufacturer name
                filteredCarsByCriterionArray.push(i);
              }
            }
            break;

          case "model":
            for (let i of this.filteredCarsArray) {
              if (i.modelName.toLowerCase().includes(this.carSearchString.toLowerCase())) { // Add to the filtered cars array only cars that include the requested search string in their model name
                filteredCarsByCriterionArray.push(i);
              }
            }
            break;

          case "year":
            for (let i of this.filteredCarsArray) {
              if (String(i.manufactureYear).slice(0, 4).includes(this.carSearchString)) { // Add to the filtered cars array only cars that include the requested search string in their manufacture year
                filteredCarsByCriterionArray.push(i);
              }
            }
            break;

          default:
            alert("Error: chosen ''filter by'' variable value does not match any supported option"); // Error message in case somehow the "filter by" variable gets a foreign value
            break;
        }

        this.filteredCarsArray = filteredCarsByCriterionArray; // Updates the array of cars to view, to include only cars matching the search criteria

      }
    );

  }

  selectCar(chosenCar: IWorkingCar): void {
    this.chosenCar.setChosenCar(chosenCar); // Remember the car the user has clicked on for viewing in the rent page
    this.rentDateService.setRentDate(this.startDate); // Remember the requested rent date for showing that value as default value in the rent page
    this.returnDateService.setReturnDate(this.endDate); // Remember the requested return date for showing that value as default value in the rent page
    this.secureInCarsMemory(chosenCar); // Makes sure the car's id appears in local storage as a previously viewed car, and adds it otherwise

    this.navigate("rent"); // Navigate to the rent page
  }

  secureInCarsMemory(chosenCar: IWorkingCar): void { // Makes sure the car's id appears in local storage as a previously viewed car, and adds it otherwise

    this.initializeViewedCarsMemory(); // Extra safety measure, to prevent failure in writing to local storage due to the "viewed cars" key somehow not existing. Makes sure it does exist

    if (localStorage.viewedCars == "") { // If the "viewed cars" key exists but is empty, just add the car's id
      localStorage.viewedCars += chosenCar.id;
      return;
    }

    let tempViewedCarArray = JSON.parse("[" + localStorage.viewedCars + "]"); // If the "viewed cars" key exists and isn't empty, see if the chosen car's id exists there, and if it does - do nothing
    for (let i of tempViewedCarArray) {
      if (i == chosenCar.id) return;
    }

    localStorage.viewedCars += "," + chosenCar.id; // If the chosen car's id doesn't exists under "viewed cars", add it
  }

  navigate(destination: string): void { // Navigate to the page according to the link pressed
    this.router.navigate(["user/" + destination]);
  }


}
