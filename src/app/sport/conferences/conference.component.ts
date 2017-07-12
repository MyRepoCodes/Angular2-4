import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { HttpSportService } from '../../shared/services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';
import { SelectSportComponent } from '../../shared/components/select/select-sport.component';
import { SelectLeagueComponent } from '../../shared/components/select/select-league.component';

const emptyConference = {
  result: {
    id: '',
    iid: 0,
    name: '',
    abbreviation: '',
    league: { id: '', iid: 0, name: '', abbr: '' },
    sport: { id: '', iid: 0 }
  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-conference',
  templateUrl: 'conference.component.html'
})
export class ConferenceComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;

  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public conference: any;
  public sportId: string;
  public sportItems: any[];
  public leagueId: string;
  public leagueItems: any[];

  public form: FormGroup;
  private sub: Subscription;

  constructor(
    public builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.loading = false;
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required],
      abbreviation: ['', Validators.required],
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Conference';
    } else {
      this.title = 'Edit Conference';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        conferenceId: params['id'],
        sportId: params['sportId'],
        leagueId: params['leagueId']
      }))
      .mergeMap(
        params => {
          if (this.mode === 'create') {
            return Observable.of(emptyConference);
          } else {
            return this.sportService.getConference(params.conferenceId);
          }
        }, (params, conference) => ({ params: params, conference: conference })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(conference) {
    const toUpdate = Object.assign(
      {},
      this.conference,
      { name: conference.name },
      { abbreviation: conference.abbreviation }
    );
    toUpdate.id = conference.id;
    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = conference.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;
    if (!toUpdate.league) {
      toUpdate.league = { id: '', iid: 0 };
    }
    toUpdate.league.id = conference.leagueId;
    const league = this.selectLeague.leagueEntity();
    if (league !== undefined) {
      toUpdate.league.iid = league.iid;
      toUpdate.league.name = league.name;
      toUpdate.league.abbr = league.abbreviation || 'abbr';
    }
    if (this.mode === 'create') {
      this.sportService.postConference(toUpdate).subscribe(
        result => {
          this.notifications.showSuccess('Conference Created');
          this.router.navigate(['../', result.result], { relativeTo: this.route });
        },
        err => this.notifications.showError('Cannot Create Conference', err.toString())
      );
    } else {
      this.sportService.putConference(toUpdate).subscribe(
        () => {
          this.notifications.showSuccess('Conference Updated');
        },
        err => this.notifications.showError('Cannot Update Conference', err.toString())
      );
    }
  }

  onDelete(conferenceId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Conference?',
      accept: () => {
        this.sportService.deleteConference(conferenceId).subscribe(
          () => {
            this.notifications.showSuccess('Conference Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Conference', err.toString())
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  onSuccess = (result: any): void => {
    this.conference = result.conference.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    if (this.mode === 'create') {
      this.conference.sport.id = this.sportId;
      this.conference.league.id = this.leagueId;

    } else {
      this.sportId = this.conference.sport.id;
      if (this.conference.league) {
        this.leagueId = this.conference.league.id;
      }

    }
    this.form.patchValue({ sportId: this.sportId });
    this.form.patchValue({ leagueId: this.leagueId });
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load conference', 3);
  }

  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
  }

  leagueChanged(leagueId) {
    this.leagueId = leagueId;
    this.form.patchValue({ leagueId: leagueId });
  }
}
