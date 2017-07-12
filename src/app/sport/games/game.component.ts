import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentRef } from '../../shared/entities/document-ref.entity';
import * as moment from 'moment';
import 'moment-timezone';
import { Observable } from 'rxjs/Observable';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';
import { TimeZone, TIMEZONES } from './components/select-timezone/timezones';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpSportService } from '../../shared/services/sport.service';
import { ConfirmationService } from 'primeng/primeng';
import { SelectSportComponent } from '../../shared/components/select/select-sport.component';
import { SelectLeagueComponent } from '../../shared/components/select/select-league.component';
import { SelectCompetitionComponent } from '../../shared/components/select/select-competition.component';
import { SelectTeamComponent } from '../../shared/components/select/select-team.component';
import { SelectVenueComponent } from '../../shared/components/select/select-venue.component';
import { SelectSeasonComponent } from '../../shared/components/select/select-season.component';

type EditMode = 'create' | 'edit';
const emptyGame = {
  sport: {},
  league: {},
  season: {},
  competition: {},
  homeTeam: {},
  awayTeam: {},
  venue: {}
};

@Component({
  selector: 'sn-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  // @Input() gameId: string;
  // @Input() utcDate: string;
  // @Input() sportId: string;
  // @Input() leagueId: string;
  // @Input() seasonId: string;
  // @Input() competitionId: string;
  // @Input() homeTeamId: string;
  // @Input() awayTeamId: string;
  // @Input() venueId: string;
  // @Input() createMode: boolean;

  // @Output() create = new EventEmitter(false);
  // @Output() patch = new EventEmitter(false);
  // @Output() remove = new EventEmitter(false);
  // @Output() cancel = new EventEmitter(false);
  // @Output() details = new EventEmitter(false);

  @ViewChild('selectSport') selectSport: SelectSportComponent;
  @ViewChild('selectLeague') selectLeague: SelectLeagueComponent;
  @ViewChild('selectSeason') selectSeason: SelectSeasonComponent;
  @ViewChild('selectCompetition') selectCompetition: SelectCompetitionComponent;
  @ViewChild('selectHomeTeam') selectHomeTeam: SelectTeamComponent;
  @ViewChild('selectAwayTeam') selectAwayTeam: SelectTeamComponent;
  @ViewChild('selectVenue') selectVenue: SelectVenueComponent;

  game;
  utcDate: Date;
  sportId: string;
  leagueId: string;
  seasonId: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;

  form: FormGroup;
  mode: EditMode;
  title: string;
  loading: boolean;

  private timezone: TimeZone;

  constructor(
    private builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private notifications: NotificationService,
    private sportService: HttpSportService
  ) {
    this.loading = false;
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required],
      timeZone: [''],
      homeScore: [''],
      awayScore: [''],
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required],
      seasonId: ['', Validators.required],
      competitionId: ['', Validators.required],
      homeTeamId: ['', Validators.required],
      awayTeamId: ['', Validators.required],
      venueId: [''],
      utc: [''],
      doubleHeader: ['']
    });
  }

  ngOnInit(): any {
    this.mode = this.route.snapshot.data['mode'];

    if (this.mode === 'create') {
      this.title = 'Create Game';
    } else {
      this.title = 'Edit Game';
    }

    this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        gameId: params['id'],
        sportId: params['sportId'],
        leagueId: params['leagueId'],
        seasonId: params['seasonId'],
        competitionId: params['competitionId'],
        homeTeamId: params['homeTeamId'],
        awayTeamId: params['awayTeamId'],
        venueId: params['venueId']
      }))
      .mergeMap(
        params => {
          if (this.mode === 'create') {
            return Observable.of({ result: emptyGame });
          } else {
            return this.sportService.getGameById(params.gameId);
          }
        }, (params, game) => ({ params: params, game: game })
      ).subscribe(this.onSuccess, this.onError);
  }

  onSuccess = (result: any): void => {
    this.game = result.game.result;
    this.sportId = result.params.sportId;
    this.leagueId = result.params.leagueId;
    this.seasonId = result.params.seasonId;
    this.competitionId = result.params.competitionId;
    this.homeTeamId = result.params.homeTeamId;
    this.awayTeamId = result.params.awayTeamId;
    this.venueId = result.params.venueId;
    if (this.mode === 'create') {
      this.game.sport.id = this.sportId;
      this.game.league.id = this.leagueId;
      this.game.season.id = this.seasonId;
      this.game.competition.id = this.competitionId;
      this.game.homeTeam.id = this.homeTeamId;
      this.game.awayTeam.id = this.awayTeamId;
      this.game.venue.id = this.venueId;
    } else {
      // TimeZone Adjustment
      const converted = DateTimeUtils.CreateDateFromUtcAndTimezone(this.game.utc, this.game.timeZone);
      this.utcDate = converted.date;
      this.game.timeZone = converted.timeZone;
      // end TimeZone Adjustment

      this.sportId = this.game.sport.id;
      if (this.game.league) {
        this.leagueId = this.game.league.id;
      }
      if (this.game.season) {
        this.seasonId = this.game.season.id;
      }
      if (this.game.competition) {
        this.competitionId = this.game.competition.id;
      }
      if (this.game.homeTeam) {
        this.homeTeamId = this.game.homeTeam.id;
      }
      if (this.game.awayTeam) {
        this.awayTeamId = this.game.awayTeam.id;
      }
      if (this.game.venue) {
        this.venueId = this.game.venue.id;
      }
    }

    this.form.patchValue({ sportId: this.sportId });
    this.form.patchValue({ leagueId: this.leagueId });
    this.form.patchValue({ seasonId: this.seasonId });
    this.form.patchValue({ competitionId: this.competitionId });
    this.form.patchValue({ homeTeamId: this.homeTeamId });
    this.form.patchValue({ awayTeamId: this.awayTeamId });
    this.form.patchValue({ venueId: this.venueId });
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load game', 3);
  }

  onPropertyChanged(propName, propValue) {
    this[propName] = propValue;
    const v = {};
    v[propName] = propValue;
    this.form.patchValue(v);
  }

  onTimezoneChanged(tz: TimeZone) {
    this.form.patchValue({ timeZone: tz.windowsTimeZone });
    // this.form.controls['timeZone'].setValue(tz.windowsTimeZone);
    this.timezone = tz;

  }

  onSubmit(game) {

    const sport = this.selectSport.sportEntity();
    const league = this.selectLeague.leagueEntity();
    const season = this.selectSeason.seasonEntity();
    const competition = this.selectCompetition.competitionEntity();
    const homeTeam = this.selectHomeTeam.teamEntity();
    const awayTeam = this.selectAwayTeam.teamEntity();
    const venue = this.selectVenue.venueEntity();

    // start TimeZone Adjustment
    // convert local date from p-calendar to UTC and strip time part (API expect DateTime without Time part)
    // const date = moment.utc(form.date).format(DateTimeUtils.ServerDateFormat);
    // info: this utcDate is synced with p-calendar (p-calendar support only local dates).
    // see: games-edit.container.ts line 116
    const UTC = 'UTC';
    let windowsTimeZone = game.timeZone || this.game.timeZone || UTC;
    let ianaTimeZone: string;
    // check if user selected timezone
    if (this.timezone && this.timezone.ianaTimeZone) {
      windowsTimeZone = this.timezone.windowsTimeZone;
      ianaTimeZone = this.timezone.ianaTimeZone;
    } else { // use game timezone otherwise
      const tz = TIMEZONES.filter(t => t.windowsTimeZone === windowsTimeZone)[0] || TIMEZONES.filter(t => t.windowsTimeZone === UTC)[0];
      ianaTimeZone = tz.ianaTimeZone;
    }
    // extract [YYYY, MM, DD, hh, mm] from local time date value
    // using this value and iana time zone create DateTime in proper timezone
    const timeArr = DateTimeUtils.CreateDateTimeArray(game.utc);
    const date = DateTimeUtils.CreateServerDateStringFromArray(timeArr);
    const convertedToTimeZoneDateStr = moment.tz(timeArr, ianaTimeZone).format();
    // convert this DateTime to UTC
    const utcDate = moment.utc(convertedToTimeZoneDateStr);
    const utc = moment(utcDate).format();
    // end TimeZone Adjustment

    const toUpdate = Object.assign(
      {},
      this.game,
      {
        name: game.name,
        date: date,
        utc: utc,
        timeZone: windowsTimeZone,
        homeScore: +game.homeScore,
        awayScore: +game.awayScore,
        doubleHeader: game.doubleHeader,
      }
    );

    if (!toUpdate.sport) {
      toUpdate.sport = new DocumentRef();
    }
    toUpdate.sport.id = game.sportId;
    toUpdate.sport.iid = sport.iid;

    toUpdate.league = league;
    toUpdate.league.abbr = league.abbreviation;
    toUpdate.homeTeam = homeTeam;
    toUpdate.homeTeam.abbr = homeTeam.abbreviation;
    toUpdate.awayTeam = awayTeam;
    toUpdate.awayTeam.abbr = awayTeam.abbreviation;
    toUpdate.season = season;
    toUpdate.competition = competition;
    toUpdate.venue = venue;

    if (this.mode === 'create') {
      this.sportService.postGame(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Game');
            console.log(result.errors);
          } else {
            this.notifications.showSuccess('Game Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Game', err.toString())
      );
    } else {
      this.sportService.putGame(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Update Game');
            console.log(result.errors);
          } else {
            this.notifications.showSuccess('Game Updated');
          }
        },
        err => this.notifications.showError('Cannot Update Game', err.toString())
      );
    }
  }

  onCancel() {
    // this.cancel.emit(true);
    return false;
  }

  onDelete(id) {
    this.sportService.deleteGame(id).subscribe(
      result => {
        if (result.error.status === 401) {
          this.notifications.showWarn('You are not authorized to delete the game ');
        } else if (result.error) {
          this.notifications.showError('Game cannot be deleted');
        } else {
          this.notifications.showSuccess('Game deleted');
          this.router.navigate(['../../../game-tracker'], { relativeTo: this.route });
        }
      });
    // this.remove.emit(id);
  }

  onDetails(id) {
    // this.details.emit(id);
  }
}

