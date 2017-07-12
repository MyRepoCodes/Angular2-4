import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'snCapitalize' })
export class CapitalizePipe implements PipeTransform {

  transform(str: string) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    }
  }
}
