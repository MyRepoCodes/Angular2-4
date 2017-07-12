import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterUtils } from '../../shared/utils';

@Component({
  selector: 'sn-compare-tool-filter',
  template: `<ng-content></ng-content>`
})
export class CompareToolFilterComponent {
  @Input() params: any = {};

  constructor(private router: Router, private route: ActivatedRoute) { }

  search() {
    const searchParams = FilterUtils.createSearchParams(this.params);
    this.router.navigate(['../compare-tool', searchParams], {relativeTo: this.route});
  }

  setParam(name: string, value: any) {
    this.params[name] = value;
  }
}
