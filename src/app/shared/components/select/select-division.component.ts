import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';
@Component({
  selector: 'sn-select-division',
  template: `
<p-dropdown
[options]="divisions"
[(ngModel)]="division"
(onChange)="onDivisionChanged($event.value)"
[style]="{'width':'100%'}"
[autoWidth]="true"
[disabled]="loading"
></p-dropdown>
`})
export class SelectDivisionComponent implements OnInit, OnDestroy {
  static emptyAction = { type: 'empty action' };
  @Input()
  set league(leagueId: string) {
    this._league = leagueId;
    this.loadByLeague(leagueId);
  }

  get league(): string {
    return this._league;
  }

  @Input() division;
  @Output() divisionChanged = new EventEmitter(false);

  divisions;
  loading = true;

  private _league;
  private emptydivisions = [{ label: 'Select Division', value: '' }];
  private sub;
  private divisionCache: any[] = [];

  constructor(
    private sportService: HttpSportService
  ) {
    this.divisions = this.emptydivisions;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  idIsSet(entity) {
    return entity && entity.id;
  }
  loadByLeague(leagueId) {
    this.loading = true;
    if (leagueId) {
      this.sub = this.sportService.getDivisionByLeague(leagueId)
        .subscribe(divisions => {
          const divisionList = divisions.result.map(s => ({ label: s.name, value: s.id }));
          this.divisions = this.emptydivisions.concat(orderBy(divisionList, 'label'));
          if (!this.isdivisionInCollection(divisions.result)) {
            this.division = '';
            this.onDivisionChanged('');
          }
          this.divisionCache = divisions.result;
          this.loading = false;
        });
    } else {
      this.division = '';
      this.onDivisionChanged('');
      this.divisions = this.emptydivisions;
      this.loading = true;
    }
  }

  private isdivisionInCollection(divisions) {
    return divisions.map(x => x.id).indexOf(this.division) !== -1;
  }

  onDivisionChanged(divisionId) {
    this.divisionChanged.emit(divisionId);
  }

  divisionEntity() {
    return this.divisionCache.filter(c => c.id === this.division)[0];
  }
}
