import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService } from 'primeng/components/common/api';
import { HttpSportService, NotificationService } from '../../shared/services';
import { SelectSportComponent } from '../../shared/components/select/select-sport.component';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';
import * as moment from 'moment';

const emptyPlayer = {
  result: {
    name: '',
    firsName: '',
    lastName: '',
    sport: { id: '', iid: 0 },
    status: '',
    id: '',
    iid: 0,
    updated: ''
  }
};
type EditMode = 'create' | 'edit';
@Component({
  selector: 'sn-player',
  templateUrl: 'player.component.html'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  // @ViewChild('selectTeam') selectTeam: SelectTeamComponent;

  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public player: any;
  public sportId: string;
  // public teamId: string;
  public form: FormGroup;
  public Bats: string;
  public Throws: string;
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      status: [''],
      college: [''],
      weight: ['', Validators.required],
      name: [''],
      height: ['', Validators.required],
      debut: [''],
      sportId: ['', Validators.required],
      birthPlace: [''],
      Throws: [''],
      Bats: [''],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Player';
    } else {
      this.title = 'Edit Player';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        playerId: params['id']
      }))
      .mergeMap(
      params => {
        if (this.mode === 'create') {
          return Observable.of(emptyPlayer);
        } else {
          return this.sportService.getPlayer(params.playerId);
        }
      }, (params, player) => ({ params: params, player: player })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(player) {
    const toUpdate = Object.assign(
      {},
      this.player,
      { name: player.firstName + ' ' + player.lastName },
      { birthDate: player.birthDate },
      { birthPlace: player.birthPlace },
      { college: player.college },
      { debut: player.debut },
      { firstName: player.firstName },
      { lastName: player.lastName },
      { bats: this.Bats },
      { throws: this.Throws },
      { height: player.height },
      { status: player.status },
      { weight: player.weight },
    );
    toUpdate.id = player.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = player.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    // if (!toUpdate.team) {
    // toUpdate.team = { id: '', iid: 0 };
    // }
    // toUpdate.team.id = player.teamId;
    // const team = this.selectTeam.teamEntity();
    // if (team !== undefined) {
    // toUpdate.team.iid = team.iid;
    // toUpdate.team.name = team.name;
    // toUpdate.team.abbr = team.abbreviation || 'abbr';
    // }
    toUpdate.birthDate = DateTimeUtils.stringifyDate(toUpdate.birthDate);
    toUpdate.debut = DateTimeUtils.stringifyDate(toUpdate.debut);
    if (this.mode === 'create') {
      this.sportService.postPlayer(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Player');
          } else {
            this.notifications.showSuccess('Player Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Player', err.toString())
      );
    } else {
      this.sportService.putPlayer(toUpdate).subscribe(
        () => {
          this.notifications.showSuccess('Player Updated');
        },
        err => this.notifications.showError('Cannot Update Player', err.toString())
      );
    }
  }

  onDelete(playerId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Player?',
      accept: () => {
        this.sportService.deletePlayer(playerId).subscribe(
          () => {
            this.notifications.showSuccess('Player Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Player', err.toString())
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

  BatsPlayingLineup(Bats) {
    this.Bats = Bats;
    this.form.patchValue({ Bats: Bats });
  }

  ThrowsPlayingLineup(Throws) {
    this.Throws = Throws;
    this.form.patchValue({ Throws: Throws });
  }

  // teamChanged(teamId) {
  //   this.teamId = teamId;
  //   this.form.patchValue({teamId: teamId});
  // }

  convertToDate(str: string) {
    return moment(str).toDate();
  }

  onSuccess = (result: any): void => {
    this.player = result.player.result;
    this.player.birthDate = this.convertToDate(this.player.birthDate);
    this.player.debut = this.convertToDate(this.player.debut);

    this.sportId = result.params.sportId;
    // this.teamId = result.params.teamId;
    if (this.mode === 'create') {
      this.player.sport.id = this.sportId;
      this.player.firstName = null;
      this.player.lastName = null;
      this.player.name = null;
    } else {
      this.sportId = this.player.sport.id;
      // if (this.player.team) {
      //   this.teamId = this.player.team.id;
      // }
      if (this.player.Bats !== undefined) {
        this.Bats = this.player.Bats;
      }
      if (this.player.Throws !== undefined) {
        this.Throws = this.player.Throws;
      }
    }
    this.form.patchValue({ sportId: this.sportId });
    // this.form.patchValue({leagueId: this.teamId});
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load player', 3);
  }
}
