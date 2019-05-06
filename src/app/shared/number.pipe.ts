import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipe implements PipeTransform {

  constructor() {
  }

  transform(number) {
    if(number){
      return number.toLocaleString();
    }
    else{
      return 0;
    }
  }
}
