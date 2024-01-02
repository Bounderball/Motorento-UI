import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inWorkingOrder'
})
export class InWorkingOrderPipe implements PipeTransform {

  transform(value: boolean): string {
    if (value) {
      return "Yes";
    }
    return "No";
  }

}
