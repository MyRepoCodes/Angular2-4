import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';
@Component({
  selector: 'sn-select-team',
  template: `
<p-dropdown
[options]="teams"
[(ngModel)]="team"
(onChange)="onTeamChanged($event.value)"
[style]="{'width':'100%'}"
[autoWidth]="true"
[disabled]="loading"
[filter]="true"
></p-dropdown>
`})
export class SelectTeamComponent implements OnInit, OnDestroy {
  static emptyAction = { type: 'empty action' };
  @Input()
  set league(leagueId: string) {
    this._league = leagueId;
    this.loadByLeague(leagueId);
  }
  get league(): string {
    return this._league;
  }

  @Input() team;
  @Output() teamChanged = new EventEmitter(false);

  teams;
  loading = true;

  private _league;
  private emptyTeam = [{ label: 'Select Team', value: '' }];
  private sub;
  private teamCache: any[] = [];

  constructor(
    private sportService: HttpSportService
  ) {
    this.teams = this.emptyTeam;
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
      this.sub = this.sportService.getTeamsByLeague(leagueId)
        .subscribe(teams => {
          const teamList = teams.result.map(s => ({ label: s.name, value: s.id }));
          this.teams = this.emptyTeam.concat(orderBy(teamList, 'label'));
          if (!this.isTeamInCollection(teams.result)) {
            this.team = '';
            this.onTeamChanged('');
          }
          this.teamCache = teams.result;
          this.loading = false;
        });
    } else {
      this.team = '';
      this.onTeamChanged('');
      this.teams = this.emptyTeam;
      this.loading = true;
    }
  }

  private isTeamInCollection(teams) {
    return teams.map(x => x.id).indexOf(this.team) !== -1;
  }

  onTeamChanged(Id) {
    this.teamChanged.emit(Id);
  }

  teamEntity() {
    return this.teamCache.filter(c => c.id === this.team)[0];
  }
}
