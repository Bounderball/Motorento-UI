import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService { // This service is used to handle all forms of httpresponse objects and try to get the most informative property for viewing (Not always used as not always successful)

  constructor() { }

  showError(error: HttpErrorResponse): void {

    console.log(error);

    if (error.hasOwnProperty('error')) {
      if (error.error.hasOwnProperty('Message')) {
        alert(error.error.Message);
      }
      else if (error.error.hasOwnProperty('errors')) {
        alert(error.error.errors[Object.keys(error.error.errors)[0]][0]);
      }
      else if (error.error.hasOwnProperty('title')) {
        alert(error.error.title);
      }
    }
    else {
      alert(error.message);
    }
  }

}
