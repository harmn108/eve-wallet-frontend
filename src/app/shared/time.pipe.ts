import {  Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time'
})
export class TimePipe implements PipeTransform{
    transform(value: any): any {
        if (!value) {
            return ;
        }

        if (value > 60) {
            const minutes = Math.floor(value / 60);
            const seconds = value - minutes * 60;
            return `${minutes} min., ${seconds} sec.`
        } else {
            return  `${value} sec.`
        }
    }

}