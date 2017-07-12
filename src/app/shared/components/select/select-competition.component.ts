import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services/sport.service';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-competition',
  template: `
<p-dropdown 
  [options]="competitions" 
  [(ngModel)]="competition"
  (onChange)="competitionChanged.emit($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectCompetitionComponent implements OnInit, OnDestroy {
  @Input()
  set league(leagueId: string) {
    this._league = leagueId;
    this.loadByLeague(leagueId);
  }

  get league(): string {
    return this._league;
  }

  @Input() competition;
  @Output() competitionChanged = new EventEmitter(false);

  competitions;
  loading = true;
  private competitionCache: any[] = [];

  private _league;
  private emptyCompetitions = [{ label: 'Select Competition', value: '' }];
  private sub;

  constructor(private sportService: HttpSportService) {
    this.competitions = this.emptyCompetitions;
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
      this.sub = this.sportService.getCompetitionsByLeagues([leagueId])
        .subscribe(competitions => {
          const competitionList = competitions.result.map(s => ({ label: s.name, value: s.id }));
          this.competitions = this.emptyCompetitions.concat(orderBy(competitionList, 'label'));

          if (!this.isCompetitionInCollection(competitions.result)) {
            this.competition = '';
            this.competitionChanged.emit('');
          }

          this.competitionCache = competitions.result;

          this.loading = false;
        });
    } else {
      this.competition = '';
      this.competitionChanged.emit('');
      this.competitions = this.emptyCompetitions;
      this.loading = true;
    }
  }

  private isCompetitionInCollection(competitions) {
    return competitions.map(x => x.id).indexOf(this.competition) !== -1;
  }

  competitionEntity() {
    return this.competitionCache.filter(l => l.id === this.competition)[0];
  }
}
