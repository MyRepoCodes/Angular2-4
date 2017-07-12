import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-league',
  template: `
<p-dropdown
  [options]="leagues"
  [(ngModel)]="league"
  (onChange)="onLeagueChanged($event.value)"
  [style]="{'width':'100%'}"
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectLeagueComponent implements OnInit, OnDestroy {
  @Input()
  set sport(sportId: string) {
    this._sport = sportId;
    this.loadBySport(sportId);
  }
  get sport(): string {
    return this._sport;
  }
  @Input() league;
  @Output() leagueChanged = new EventEmitter(false);

  leagues;
  loading = true;

  private _sport;
  private emptyLeagues = [{ label: 'Select League', value: '' }];
  private sub;
  private leagueCache: any[] = [];

  constructor(private sportService: HttpSportService) {
    this.leagues = this.emptyLeagues;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadBySport(sportId) {
    this.loading = true;

    if (sportId) {
      this.sub = this.sportService.getLeagues(sportId).subscribe(result => {
        const leagueList = result.result.map(s => ({ label: s.name, value: s.id }));
        this.leagues = this.emptyLeagues.concat(orderBy(leagueList, 'label'));

        if (!this.isLeagueInCollection(result.result)) {
          this.league = '';
          this.onLeagueChanged('');
        }

        this.leagueCache = result.result;

        this.loading = false;
      });
    } else {
      this.league = '';
      this.onLeagueChanged('');
      this.leagues = this.emptyLeagues;
      this.loading = true;
    }
  }

  private isLeagueInCollection(leagues) {
    return leagues.map(x => x.id).indexOf(this.league) !== -1;
  }

  onLeagueChanged(leagueId) {
    this.leagueChanged.emit(leagueId);
  }

  leagueEntity() {
    return this.leagueCache.filter(l => l.id === this.league)[0];
  }
}
