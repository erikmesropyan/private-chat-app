import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    if (value) {
      const date = new Date(value);
      if (date.getTime() > new Date(new Date().getTime() - (60 * 60 * 24 * 1000)).getTime()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    }
    return null;
  }

}
