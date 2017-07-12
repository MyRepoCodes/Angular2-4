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


const emptySeason = {
  result: {
    id: '',
    iid: 0,
    name: '',
    sport: { id: '', iid: 0 },
    league: { id: '', iid: 0 },
  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-season',
  templateUrl: 'season.component.html'
})
export class SeasonComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;
  @ViewChild('selectConference') selectConference: SelectConferenceComponent;


  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public season: any;
  public sportId: string;
  public leagueId: string;

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
      description: ['', Validators.required],
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Season';
    } else {
      this.title = 'Edit Season';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        seasonId: params['id'],
        sportId: params['sportId'],
        leagueId: params['leagueId'],
      }))
      .mergeMap(
      params => {
        if (this.mode === 'create') {
          return Observable.of(emptySeason);
        } else {
          return this.sportService.getSeason(params.seasonId);
        }
      }, (params, season) => ({ params: params, season: season })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(Season) {
    const toUpdate = Object.assign(
      {},
      this.season,
      { name: Season.name },
      { abbreviation: Season.abbreviation },
      { description: Season.description ? Season.description : 'des' }
    );
    toUpdate.id = Season.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = Season.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    if (!toUpdate.league) {
      toUpdate.league = { id: '', iid: 0 };
    }
    toUpdate.league.id = Season.leagueId;
    const league = this.selectLeague.leagueEntity();
    if (league !== undefined) {
      toUpdate.league.iid = league.iid;
      toUpdate.league.name = league.name;
      toUpdate.league.abbr = league.abbreviation || 'abbr';
    }

    if (this.mode === 'create') {
      this.sportService.postSeason(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Season');
          } else {
            this.notifications.showSuccess('Season Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Season', err.toString())
      );
    } else {
      this.sportService.putSeason(toUpdate).subscribe(
        () => { this.notifications.showSuccess('Season Updated'); },
        err => this.notifications.showError('Cannot Update Season', err.toString())
      );
    }
  }

  onDelete(SeasonId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Season ?',
      accept: () => {
        this.sportService.deleteSeason(SeasonId).subscribe(
          () => {
            this.notifications.showSuccess('Season Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Season', err.toString())
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
    this.season = result.season.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    if (this.mode === 'create') {
      this.season.sport.id = this.sportId;
      this.season.league.id = this.leagueId;

    } else {
      this.sportId = this.season.sport.id;
      if (this.season.description === undefined) {
        this.season.description = 'des';
      }
      if (this.season.league) {
        this.leagueId = this.season.league.id;
      }
      this.form.patchValue({ sportId: this.sportId });
      this.form.patchValue({ leagueId: this.leagueId });
      this.loading = false;
    }



  }
  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load season', 3);
  }
}
