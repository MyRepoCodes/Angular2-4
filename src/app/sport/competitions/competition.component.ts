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
const emptyCompetition = {
  result: {
    name: '',
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
  templateUrl: 'competition.component.html'
})
export class CompetitionComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;
  @ViewChild('selectConference') selectConference: SelectConferenceComponent;
  @ViewChild('selectDivision') selectdivision: SelectDivisionComponent;
  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public competition: any;
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
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required],

    });
  }
  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Competition';
    } else {
      this.title = 'Edit Competition';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        competitionId: params['id']
      }))
      .mergeMap(
      params => {
        if (this.mode === 'create') {
          return Observable.of(emptyCompetition);
        } else {
          return this.sportService.getCompetition(params.competitionId);
        }
      }, (params, competition) => ({ params: params, competition: competition })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(competition) {
    const toUpdate = Object.assign(
      {},
      this.competition,
      { name: competition.name }

    );
    toUpdate.id = competition.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = competition.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    if (!toUpdate.league) {
      toUpdate.league = { id: '', iid: 0 };
    }
    toUpdate.league.id = competition.leagueId;
    const league = this.selectLeague.leagueEntity();
    if (league !== undefined) {
      toUpdate.league.iid = league.iid;
      toUpdate.league.name = league.name;
      toUpdate.league.abbr = league.abbreviation || 'abbr';
    }
    if (this.mode === 'create') {
      this.sportService.postCompetition(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Competition');
          } else {
            this.notifications.showSuccess('Competition Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Competition', err.toString())
      );
    } else {
      this.sportService.putCompetition(toUpdate).subscribe(
        () => { this.notifications.showSuccess('Competition Updated'); },
        err => this.notifications.showError('Cannot Update Competition', err.toString())
      );
    }
  }

  onDelete(teamId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Competition?',
      accept: () => {
        this.sportService.deleteTeam(teamId).subscribe(
          () => {
            this.notifications.showSuccess('Competition Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Competition', err.toString())
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

  onSuccess = (result: any): void => {
    this.competition = result.competition.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    this.conferenceId = result.params.conferenceId;
    this.divisionId = result.params.divisionId;
    if (this.mode === 'create') {
      this.competition.sport.id = this.sportId;
      this.competition.league.id = this.leagueId;

    } else {
      this.sportId = this.competition.sport.id;
      if (this.competition.league) {
        this.leagueId = this.competition.league.id;
      }

    }
    this.form.patchValue({ sportId: this.sportId });
    this.form.patchValue({ leagueId: this.leagueId });

    this.loading = false;
  }
  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load Competition', 3);
  }
}
