import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services/sport.service';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-season',
  template: `
<p-dropdown 
  [options]="seasons" 
  [(ngModel)]="season"
  (onChange)="seasonChanged.emit($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectSeasonComponent implements OnInit, OnDestroy {
  @Input()
  set league(leagueId: string) {
    this._league = leagueId;
    this.loadByLeague(leagueId);
  }

  get league(): string {
    return this._league;
  }

  @Input() season;
  @Output() seasonChanged = new EventEmitter(false);

  seasons;
  loading = true;
  private seasonCache: any[] = [];

  private _league;
  private emptySeasons = [{ label: 'Select Season', value: '' }];
  private sub;

  constructor(private sportService: HttpSportService) {
    this.seasons = this.emptySeasons;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadByLeague(leagueId) {
    this.loading = true;

    if (leagueId) {
      this.sub = this.sportService.getSeasonsByLeagues([leagueId])
        .subscribe(seasons => {
          const seasonList = seasons.result.map(s => ({ label: s.name, value: s.id }));
          this.seasons = this.emptySeasons.concat(orderBy(seasonList, 'label'));

          if (!this.isSeasonInCollection(seasons.result)) {
            this.season = '';
            this.seasonChanged.emit('');
          }

          this.seasonCache = seasons.result;

          this.loading = false;
        });
    } else {
      this.season = '';
      this.seasonChanged.emit('');
      this.seasons = this.emptySeasons;
      this.loading = true;
    }
  }

  private isSeasonInCollection(seasons) {
    return seasons.map(x => x.id).indexOf(this.season) !== -1;
  }

  seasonEntity() {
    return this.seasonCache.filter(l => l.id === this.season)[0];
  }
}
