import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-sport',
  template: `
<p-dropdown
  [options]="sports"
  [(ngModel)]="sport"
  (onChange)="onSportChanged($event.value)"
  [style]="{'width':'100%'}"
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectSportComponent implements OnInit, OnDestroy {
  @Input() sport;
  @Output() sportChanged = new EventEmitter(false);

  sports;
  loading = true;

  private emptySports = [{ label: 'Select Sport', value: '' }];
  private sportCache: any[] = [];
  private sub;

  constructor(private sportService: HttpSportService) {
    this.sports = this.emptySports;
  }

  ngOnInit() {
    this.sub = this.sportService.getSports().subscribe(result => {
      const sportList = result.result.map(s => ({ label: s.name, value: s.id }));
      this.sports = this.emptySports.concat(orderBy(sportList, 'label'));
      this.sportCache = result.result;

      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSportChanged(sportId) {
    this.sportChanged.emit(sportId);
  }

  sportEntity() {
    return this.sportCache.filter(s => s.id === this.sport)[0];
  }
}
