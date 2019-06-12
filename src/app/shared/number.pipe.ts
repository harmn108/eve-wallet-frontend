import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberPipe'
})
export class NumberPipe implements PipeTransform {

    constructor() {
    }

    transform(number, ...args) {
        if (typeof number !== 'string') {
            return number;
        }
        const intStr: string = number.split('.')[0];

        let b = intStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        if (number.split('.')[1]) {
            return b + '.' + number.split('.')[1].substr(0, 8);
        }

        return b;
    }
}
