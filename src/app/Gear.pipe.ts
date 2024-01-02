import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gear'
})
export class GearPipe implements PipeTransform {

  transform(value: boolean): string {
    if (value){
      return "Automatic";
    }
    return "Manual";
  }

}
