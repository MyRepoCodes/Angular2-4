import * as moment from 'moment';
import 'moment-timezone';
import { TIMEZONES } from '../../sport/games/components/select-timezone/timezones';

export enum DateConversionType {
  NoTimePart,
  ZeroTimePart,
  WithTimePart
}

export class DateTimeUtils {
  private static regex = /(\d+)\/(\d+)\/(\d+)/;
  private static apiDateRegex = /(\d+)-(\d+)-(\d+)/;

  public static CalendarDateFormat = 'MM/DD/YYYY';
  public static ServerDateFormat = 'YYYY-MM-DD';
  public static ServerDateTimeFormat = 'YYYY-MM-DD HH:mm';

  public static CreateServerDateStringFromArray(arr: number[]): string {
    const datePart = DateTimeUtils.CreateServerDateStringWithoutTimeFromArray(arr);
    return `${datePart}T00:00:00.000Z`;
  }

  public static CreateServerDateStringWithoutTimeFromArray(arr: number[]): string {
    const year = arr[0];
    const day = ('0' + arr[2]).slice(-2); // we need to ensure leading zero if it's a single digit number (we want '04' instead of '4')
    const month = ('0' + (arr[1] + 1)).slice(-2); // the same as above plus taking month 0-base into account
    return `${year}-${month}-${day}`;
  }

  public static CreateServerDateStringWithTimeFromArray(arr: number[]): string {
    const datePart = DateTimeUtils.CreateServerDateStringWithoutTimeFromArray(arr);
    const hour = ('0' + arr[3]).slice(-2);
    const minute = ('0' + arr[4]).slice(-2);
    return `${datePart}T${hour}:${minute}:00.000Z`;
  }

  public static CreateDateTimeArray(d: Date): number[] {
    return [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()];
  }

  public static DateTimeToISOStringIgnoringTimeZone(d: Date, conversionType: DateConversionType) {
    const dateArray = DateTimeUtils.CreateDateTimeArray(d);
    let result: string;
    switch (conversionType) {
      case DateConversionType.NoTimePart:
        result = DateTimeUtils.CreateServerDateStringWithoutTimeFromArray(dateArray);
        break;
      case DateConversionType.ZeroTimePart:
        result =  DateTimeUtils.CreateServerDateStringFromArray(dateArray);
        break;
      default:
        result = DateTimeUtils.CreateServerDateStringWithTimeFromArray(dateArray);
        break;
    }
    return result;
  }

  public static CalendarDateToApiDate(date: string): string {
    if (DateTimeUtils.regex.test(date)) {
      const MM = date.match(DateTimeUtils.regex)[1];
      const DD = date.match(DateTimeUtils.regex)[2];
      const YYYY = date.match(DateTimeUtils.regex)[3];
      return `${YYYY}-${MM}-${DD}`;
    }

    return undefined;
  }

  // This method takes a Date object and adjusts its values to match a UTC time.
  // Note that it will still return a regular Date object, that is bound to your local timezone.
  // But the value itself will be UTC date and time.
  public static DateToUtcValue(date: Date): Date {
    const utcOffset = moment(date).utcOffset();
    const neededDate = moment(date).subtract(utcOffset, 'm').toDate();
    return neededDate;
  }

  public static ApiDateToString(date: string): string {
    if (!date) {
      return '';
    }
    if (date.lastIndexOf('T') === -1) {
      return '';
    }
    const dateTime = date.split('T')[0];
    if (DateTimeUtils.apiDateRegex.test(dateTime)) {
      const YYYY = dateTime.match(DateTimeUtils.apiDateRegex)[1];
      const MM = dateTime.match(DateTimeUtils.apiDateRegex)[2];
      const DD = dateTime.match(DateTimeUtils.apiDateRegex)[3];
      return `${MM}/${DD}/${YYYY}`;
    }
    return '';
  }

  public static stringifyDate(d: Date): string {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }

  public static stringifyMomentDate(d: any): string {
    return d.format(DateTimeUtils.CalendarDateFormat);
  }

  public static stringifyDateAndTime(d: Date): string {
    const date = DateTimeUtils.stringifyDate(d);
    let hours = d.getHours().toString();
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    let minutes = d.getMinutes().toString();
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    return `${date} ${hours}:${minutes}`;
  }

  // If the passed date has same DD-MM-YY this will return string in form of "x hours/minutes ago".
  public static formatAsTimeSinceOrDate(d: Date): string {
    const now = new Date();
    if (now.getFullYear() === d.getFullYear()) {
      if (now.getMonth() === d.getMonth()) {
        if (now.getDate() === d.getDate()) {
          return DateTimeUtils.formatAsTimeSince(d);
        }
      }
    }
    return DateTimeUtils.stringifyDateAndTime(d);
  }

  public static formatAsTimeSince(d: Date): string {
    const now = new Date();
    const hoursDiff = now.getHours() - d.getHours();
    if (hoursDiff > 0) {
      return `${hoursDiff} hours ago`;
    }
    const minutesDiff = now.getMinutes() - d.getMinutes();
    if (minutesDiff > 0) {
      return `${minutesDiff} minutes ago`;
    }
    return 'just now';
  }

  public static CreateDateFromUtcAndTimezone(utc: string, timeZone: string): { date: Date, timeZone: string, timeZoneAbbr: string } {
    const UTC = 'UTC';
    let windowsTimeZone = timeZone || UTC;
    // workaround for EST, we have a lot of games in mongo with timeZone=EST isntead of 'Eastern Standard Time'
    // todo: remove this workaround whed db will be updated
    if (windowsTimeZone === 'EST') {
      windowsTimeZone = 'Eastern Standard Time';
      timeZone = windowsTimeZone;
    }
    // info: we need additional check for t.windowsTimeZone === 'UTC' because right now it's possible to receive not .NET TimeZoneId
    // if there is unknown TimeZoneId, use UTC as a default
    // todo: remove check for t.windowsTimeZone === 'UTC' when API part will be ready
    const tz = TIMEZONES.filter(t => t.windowsTimeZone === windowsTimeZone)[0] || TIMEZONES.filter(t => t.windowsTimeZone === UTC)[0];
    const dateValue = moment.tz(utc || moment.utc().format(), tz.ianaTimeZone);
    const dateStr = dateValue.format(DateTimeUtils.ServerDateTimeFormat);
    return { date: moment(dateStr).toDate(), timeZone: timeZone, timeZoneAbbr: dateValue.format('z') };
  }

}
