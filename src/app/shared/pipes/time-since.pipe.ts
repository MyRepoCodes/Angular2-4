import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtils } from '../utils/datetime-utils';

@Pipe({ name: 'snTimeSince' })
export class TimeSincePipe implements PipeTransform {

  transform(date) {
    if (date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return DateTimeUtils.formatAsTimeSinceOrDate(date);
    }
  }
}
