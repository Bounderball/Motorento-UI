import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(value: boolean): string {
    if (value){
      return "Male";
    }
    return "Female";
  }

}
