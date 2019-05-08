import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipe implements PipeTransform {

  constructor() {
  }

  transform(number) {
    if(number){
      let stringValue = number.toString();
      let stringArr = stringValue.split('.');
      let digits = 0;
      if(stringArr[1]){
        digits = stringArr[1].length;
      }
      return number.toLocaleString(undefined, { minimumFractionDigits: digits });
    }
    else{
      return 0;
    }
  }
}
