import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtils } from '../utils/datetime-utils';

@Pipe({ name: 'snDate' })
export class DatePipe implements PipeTransform {

  transform(date) {
    if (date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return DateTimeUtils.stringifyDate(date);
    }
  }
}
