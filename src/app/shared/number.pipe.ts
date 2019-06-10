import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipe implements PipeTransform {

  constructor() {
  }

  transform(number, ...args) {
    let stringValue;
    // if(number){
    //   stringValue = Number(number).toString();
    //     let stringArr = stringValue.split('.');
    //   let digits = 0;
    //   if(stringArr[1]){
    //     digits = stringArr[1].toString().length;
    //   }
    //   return Number(stringValue).toLocaleString(undefined, { minimumFractionDigits: digits });
    // }
    // else{
    //   return 0;
    // }
      if (typeof number !== 'string') {
        return number;
      }
      return number.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
  }
}
