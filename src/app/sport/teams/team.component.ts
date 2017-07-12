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
import { SelectDivisionComponent } from '../../shared/components/select/select-division.component';
const emptyTeam = {
  result: {
    name: '',
    abbreviation: '',
    customer: false,
    fullName: '',
    division: {
      name: '',
      id: '',
      iid: 0
    },
    conference: {
      name: '',
      id: '',
      iid: 0
    },
    league: {
      name: '',
      abbr: '',
      id: '',
      iid: 0
    },
    sport: {
      id: '',
      iid: 0
    },
    id: '',
    iid: 0,
    updated: ''
  }
};
type EditMode = 'create' | 'edit';
@Component({
  selector: 'sn-team',
  templateUrl: 'team.component.html'
})
export class TeamComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;
  @ViewChild('selectConference') selectConference: SelectConferenceComponent;
  @ViewChild('selectDivision') selectdivision: SelectDivisionComponent;
  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public team: any;
  public sportId: string;
  public leagueId: string;
  public conferenceId: string;
  public divisionId: string;
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
      customer: [''],
      fullName: ['', Validators.required],
      timeZone: [''],
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required],
      divisionId: ['', Validators.required],
      conferenceId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Team';
    } else {
      this.title = 'Edit Team';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        teamId: params['id']
      }))
      .mergeMap(
        params => {
          if (this.mode === 'create') {
            return Observable.of(emptyTeam);
          } else {
            return this.sportService.getTeam(params.teamId);
          }
        }, (params, team) => ({ params: params, team: team })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(team) {
    const toUpdate = Object.assign(
      {},
      this.team,
      { name: team.name },
      { abbreviation: team.abbreviation },
      { fullName: team.fullName },
      { timeZone: team.timeZone },
    );
    toUpdate.id = team.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = team.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    if (!toUpdate.league) {
      toUpdate.league = { id: '', iid: 0 };
    }
    toUpdate.league.id = team.leagueId;
    const league = this.selectLeague.leagueEntity();
    if (league !== undefined) {
      toUpdate.league.iid = league.iid;
      toUpdate.league.name = league.name;
      toUpdate.league.abbr = league.abbreviation || 'abbr';
    }
    if (!toUpdate.conference) {
      toUpdate.conference = { id: '', iid: 0 };
    }
    toUpdate.conference.id = team.conferenceId;
    const conference = this.selectConference.conferenceEntity();
    if (conference !== undefined) {
      toUpdate.conference.iid = conference.iid;
      toUpdate.conference.name = conference.name;
      toUpdate.conference.abbr = conference.abbreviation ? conference.abbreviation : 'abbr';
    }
    toUpdate.division.id = team.divisionId;
    const division = this.selectdivision.divisionEntity();
    if (division !== undefined) {
      toUpdate.division.iid = division.iid;
      toUpdate.division.name = division.name;
      toUpdate.division.abbr = division.abbreviation ? division.abbreviation : 'abbr';
    }
    if (this.mode === 'create') {
      this.sportService.postTeam(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Team');
          } else {
            this.notifications.showSuccess('Team Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Team', err.toString())
      );
    } else {
      this.sportService.putTeam(toUpdate).subscribe(
        () => {
          this.notifications.showSuccess('Team Updated');
        },
        err => this.notifications.showError('Cannot Update Team', err.toString())
      );
    }
  }

  onDelete(teamId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Team?',
      accept: () => {
        this.sportService.deleteTeam(teamId).subscribe(
          () => {
            this.notifications.showSuccess('Team Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Team', err.toString())
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

  divisionChanged(divisionId) {
    this.divisionId = divisionId;
    this.form.patchValue({ divisionId: divisionId });
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
    this.team = result.team.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    this.conferenceId = result.params.conferenceId;
    this.divisionId = result.params.divisionId;
    if (this.mode === 'create') {
      this.team.sport.id = this.sportId;
      this.team.league.id = this.leagueId;
      this.team.conference.id = this.conferenceId;
      this.team.division.id = this.divisionId;
    } else {
      this.sportId = this.team.sport.id;
      if (this.team.league) {
        this.leagueId = this.team.league.id;
      }
      if (this.team.conference) {
        this.conferenceId = this.team.conference.id;
      }
      if (this.team.division) {
        this.divisionId = this.team.division.id;
      }
    }
    this.form.patchValue({ sportId: this.sportId });
    this.form.patchValue({ leagueId: this.leagueId });
    this.form.patchValue({ conferenceId: this.conferenceId });
    this.form.patchValue({ divisionId: this.divisionId });
    this.loading = false;
  }
  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load team', 3);
  }
}
