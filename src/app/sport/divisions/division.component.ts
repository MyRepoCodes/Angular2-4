import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService } from 'primeng/components/common/api';
import { HttpSportService, NotificationService } from '../../shared/services';
import { SelectSportComponent } from '../../shared/components/select/select-sport.component';
import { SelectLeagueComponent } from '../../shared/components/select/select-league.component';
import { SelectConferenceComponent } from '../../shared/components/select/select-conference.component';

const emptyDivision = {
  result: {
    id: '',
    iid: 0,
    name: '',
    abbreviation: '',
    sport: { id: '', iid: 0 },
    league: { id: '', iid: 0 },
    conference: { id: '', iid: 0 }
  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-division',
  templateUrl: 'division.component.html'
})
export class DivisionComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;
  @ViewChild('selectConference') selectConference: SelectConferenceComponent;


  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public division: any;
  public sportId: string;
  public leagueId: string;
  public conferenceId: string;
  public conferenceIds: string;

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
      conferenceId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Division';
    } else {
      this.title = 'Edit Division';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        divisionId: params['id'],
        sportId: params['sportId'],
        leagueId: params['leagueId'],
        conferenceId: params['conferenceId'],
      }))
      .mergeMap(
      params => {
        if (this.mode === 'create') {
          return Observable.of(emptyDivision);
        } else {
          return this.sportService.getDivision(params.divisionId);
        }
      }, (params, division) => ({ params: params, division: division })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(division) {
    const toUpdate = Object.assign(
      {},
      this.division,
      { name: division.name },
      { abbreviation: division.abbreviation }
    );
    toUpdate.id = division.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = division.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    if (!toUpdate.league) {
      toUpdate.league = { id: '', iid: 0 };
    }
    toUpdate.league.id = division.leagueId;
    const league = this.selectLeague.leagueEntity();
    if (league !== undefined) {
      toUpdate.league.iid = league.iid;
      toUpdate.league.name = league.name;
      toUpdate.league.abbr = league.abbreviation || 'abbr';
    }

    if (!toUpdate.conference) {
      toUpdate.conference = { id: '', iid: 0 };
    }
    toUpdate.conference.id = division.conferenceId;
    const conference = this.selectConference.conferenceEntity();
    if (conference !== undefined) {
      toUpdate.conference.iid = conference.iid;
      toUpdate.conference.name = conference.name;
      toUpdate.conference.abbr = conference.abbreviation ? conference.abbreviation : 'abbr';
    }
    if (this.mode === 'create') {
      this.sportService.postDivision(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Division');
          } else {
            this.notifications.showSuccess('Division Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Division', err.toString())
      );
    } else {
      this.sportService.putDivision(toUpdate).subscribe(
        () => { this.notifications.showSuccess('Division Updated'); },
        err => this.notifications.showError('Cannot Update Division', err.toString())
      );
    }
  }

  onDelete(divisionId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Division?',
      accept: () => {
        this.sportService.deleteDivision(divisionId).subscribe(
          () => {
            this.notifications.showSuccess('Division Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Division', err.toString())
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
  }

  leagueChanged(leagueId) {
    this.leagueId = leagueId;
    this.form.patchValue({ leagueId: leagueId });
  }

  conferenceChanged(conferenceId) {
    this.conferenceId = conferenceId;
    this.form.patchValue({ conferenceId: conferenceId });
  }
  onSuccess = (result: any): void => {
    this.division = result.division.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    this.conferenceId = result.params.conferenceId;
    if (this.mode === 'create') {
      this.division.sport.id = this.sportId;
      this.division.league.id = this.leagueId;
      this.division.conference.id = this.conferenceId;
    } else {
      this.sportId = this.division.sport.id;
      if (this.division.league) {
        this.leagueId = this.division.league.id;
      }
      if (this.division.conference) {
        this.conferenceId = this.division.conference.id;
      }
    }

    this.form.patchValue({ sportId: this.sportId });
    this.form.patchValue({ leagueId: this.leagueId });
    this.form.patchValue({ conferenceId: this.conferenceId });
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load sport', 3);
  }

}
