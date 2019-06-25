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
            const fraction = number.split('.')[1].substr(0, 8);
            if (fraction.length < 8) {
                const repeatCount = 8 - fraction.length;
                return b + '.' + fraction + '0'.repeat(repeatCount)
            }
            return b + '.' + fraction
        }else {
            return b + '.' + '0'.repeat(8)
        }
    }
}
