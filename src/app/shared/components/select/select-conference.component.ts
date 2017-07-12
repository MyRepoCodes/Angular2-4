

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-conference',
  template: `
<p-dropdown 
  [options]="conferences" 
  [(ngModel)]="conference"
  (onChange)="onConferenceChanged($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectConferenceComponent implements OnInit, OnDestroy {
  static emptyAction = { type: 'empty action' };
  @Input()
  set league(leagueId: string) {
    this._league = leagueId;
    this.loadByLeague(leagueId);
  }

  get league(): string {
    return this._league;
  }

  @Input() conference;
  @Output() conferenceChanged = new EventEmitter(false);

  conferences;
  loading = true;

  private _league;
  private emptyConferences = [{ label: 'Select Conference', value: '' }];
  private sub;
  private conferenceCache: any[] = [];

  constructor(
    private sportService: HttpSportService
  ) {
    this.conferences = this.emptyConferences;
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
      this.sub = this.sportService.getConferencesByLeague(leagueId)
        .subscribe(conferences => {
          const conferenceList = conferences.result.map(s => ({ label: s.name, value: s.id }));
          this.conferences = this.emptyConferences.concat(orderBy(conferenceList, 'label'));
          if (!this.isConferenceInCollection(conferences.result)) {
            this.conference = '';
            this.onConferenceChanged('');
          }
          this.conferenceCache = conferences.result;
          this.loading = false;
        });
    } else {
      this.conference = '';
      this.onConferenceChanged('');
      this.conferences = this.emptyConferences;
      this.loading = true;
    }
  }

  private isConferenceInCollection(conferences) {
    return conferences.map(x => x.id).indexOf(this.conference) !== -1;
  }

  onConferenceChanged(conferenceId) {
    this.conferenceChanged.emit(conferenceId);
  }

  conferenceEntity() {
    return this.conferenceCache.filter(c => c.id === this.conference)[0];
  }
}
