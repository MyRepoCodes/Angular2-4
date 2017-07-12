import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ruleText'
})

export class RuleTextPipe implements PipeTransform {
    transform(value: any, args: any[]): any {

      const replacer = (key, val) => {
        if (key === '$type') {
          return undefined;
        }
        return val;
      };

      return JSON.stringify(value, replacer);
    }
}
