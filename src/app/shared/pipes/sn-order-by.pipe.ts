import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snOrderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(arr: any[], propName: string): any[] {
    return arr.sort((a, b) => {
      const A = (a[propName] || '').toLowerCase();
      const B = (b[propName] || '').toLowerCase();
      if (A < B) {
        return -1;
      } else if (A > B) {
        return  1;
      } else {
        return 0;
      }
    });
  }

}
