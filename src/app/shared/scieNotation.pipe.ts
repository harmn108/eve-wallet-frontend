import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'sciNotation'
})
export class ScieNotationPipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        const data = String(value).split(/[eE]/);
        if (data.length === 1) {
            return data[0];
        }

        let z = '';
        let mag = Number(data[1]) + 1;
        const sign = value < 0 ? '-' : '',
            str = data[0].replace('.', '');


        if (mag < 0) {
            z = sign + '0.';
            while (mag++) {
                z += '0';
            }
            return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) {
            z += '0';
        }
        return str + z;
    }

}