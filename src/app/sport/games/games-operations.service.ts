import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { HttpSportService } from '../../shared/services/sport.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Game } from './game.entity';

const gameState = {
  gameId: '',
  sport: '',
  league: '',
  conference: '',
  division: '',
  homeTeam: '',
  awayTeam: '',
  competition: '',
  season: '',
  venue: '',
  doubleHeader: '',
  homeScore: '',
  awayScore: '',
  timeZone: '',
  dateTime: '',
  gameName: ''
};

@Injectable()
export class GameOperationsService {
  private _selectedSport: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedLeague: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedConference: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedDivision: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedHomeTeam: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedAwayTeam: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedCompetition: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedSeason: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _selectedVenue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  /*private _doubleHeader: BehaviorSubject<string> = new BehaviorSubject<string>('');
   private _homeScore: BehaviorSubject<string> = new BehaviorSubject<string>('');
   private _awayScore: BehaviorSubject<string> = new BehaviorSubject<string>('');
   private _timeZone: BehaviorSubject<string> = new BehaviorSubject<string>('');
   private _dateTime: BehaviorSubject<string> = new BehaviorSubject<string>('');
   private _gameName: BehaviorSubject<string> = new BehaviorSubject<string>('');*/

  private _sportsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _leaguesList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _conferencesList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _divisionsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _homeTeamsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _awayTeamsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _competitionsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _seasonsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
  private _venuesList: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);

  private _game: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public readonly selectedSport: Observable<string> = this._selectedSport.asObservable();
  public readonly selectedLeague: Observable<string> = this._selectedLeague.asObservable();
  public readonly selectedConference: Observable<string> = this._selectedConference.asObservable();
  public readonly selectedDivision: Observable<string> = this._selectedDivision.asObservable();
  public readonly selectedHomeTeam: Observable<string> = this._selectedHomeTeam.asObservable();
  public readonly selectedAwayTeam: Observable<string> = this._selectedAwayTeam.asObservable();
  public readonly selectedCompetition: Observable<string> = this._selectedCompetition.asObservable();
  public readonly selectedSeason: Observable<string> = this._selectedSeason.asObservable();
  public readonly selectedVenue: Observable<string> = this._selectedVenue.asObservable();
  /*public readonly doubleHeader: Observable<string> = this._doubleHeader.asObservable();
   public readonly homeScore: Observable<string> = this._homeScore.asObservable();
   public readonly awayScore: Observable<string> = this._awayScore.asObservable();
   public readonly timeZone: Observable<string> = this._timeZone.asObservable();
   public readonly dateTime: Observable<string> = this._dateTime.asObservable();
   public readonly gameName: Observable<string> = this._gameName.asObservable();*/

  public readonly sportsList: Observable<SelectItem[]> = this._sportsList.asObservable();
  public readonly leaguesList: Observable<SelectItem[]> = this._leaguesList.asObservable();
  public readonly conferencesList: Observable<SelectItem[]> = this._conferencesList.asObservable();
  public readonly divisionsList: Observable<SelectItem[]> = this._divisionsList.asObservable();
  public readonly homeTeamsList: Observable<SelectItem[]> = this._homeTeamsList.asObservable();
  public readonly awayTeamsList: Observable<SelectItem[]> = this._awayTeamsList.asObservable();
  public readonly competitionsList: Observable<SelectItem[]> = this._competitionsList.asObservable();
  public readonly seasonsList: Observable<SelectItem[]> = this._seasonsList.asObservable();
  public readonly venuesList: Observable<SelectItem[]> = this._venuesList.asObservable();

  public readonly game: Observable<any> = this._game.asObservable();

  constructor(private sportHttpService: HttpSportService,
    private notificationService: NotificationService,
    private router: Router) {
    this.selectedSport.subscribe(sport => {
      this.getLeaguesBySport(sport).subscribe(leagues => {
        this.loadLeagues(leagues);
      });

      this.getVenuesBySport(sport).subscribe(venues => {
        this.loadVenues(venues);

      });
    });

    this.selectedLeague.subscribe(league => {
      this.getTeamsByLeague(league).subscribe(res => {
        this.loadTeams(res);
      });

      this.getCompetitionsByLeagues(league).subscribe(res => {
        this.loadCompetitions(res);
      });

      this.getSeasonsByLeagues(league).subscribe(res => {
        this.loadSeasons(res);
      });
    });
  }

  loadInitialState(gameId) {
    if (gameId) {
      this.sportHttpService.getGameById(gameId)
        .map(res => res.result)
        .subscribe((game: Game) => {
          this._selectedSport.next(game.sport ? game.sport.id : null);
          this._selectedLeague.next(game.league ? game.league.id : null);
          this._selectedHomeTeam.next(game.homeTeam ? game.homeTeam.id : null);
          this._selectedAwayTeam.next(game.awayTeam ? game.awayTeam.id : null);
          this._selectedCompetition.next(game.competition ? game.competition.id : null);
          this._selectedSeason.next(game.season ? game.season.id : null);
          this._selectedVenue.next(game.venue ? game.venue.id : null);
        });
    } else {
      this._sportsList.next(this.mapToSelectItemList([], 'Sport'));
      this._leaguesList.next(this.mapToSelectItemList([], 'League'));
      this._homeTeamsList.next(this.mapToSelectItemList([], 'Home Team'));
      this._awayTeamsList.next(this.mapToSelectItemList([], 'Away Team'));
      this._seasonsList.next(this.mapToSelectItemList([], 'Season'));
      this._competitionsList.next(this.mapToSelectItemList([], 'Competition'));
      this._venuesList.next(this.mapToSelectItemList([], 'Venue'));
    }
  }

  onSportSelected(id) {
    gameState.sport = id;
    this._selectedSport.next(id);

    this.clearUnderLeagueState();
    gameState.league = '';
    this._selectedLeague.next('');
  }

  onLeagueSelected(id) {
    gameState.league = id;
    this._selectedLeague.next(id);

    this.clearUnderLeagueState();
  }

  onConferenceSelected(id) {
    gameState.conference = id;
    this._selectedConference.next(id);
  }

  onDivisionSelected(id) {
    gameState.division = id;
    this._selectedDivision.next(id);
  }

  onHomeTeamSelected(id) {
    gameState.homeTeam = id;
    this._selectedHomeTeam.next(id);
  }

  onAwayTeamSelected(id) {
    gameState.awayTeam = id;
    this._selectedAwayTeam.next(id);
  }

  onCompetitionSelected(id) {
    gameState.competition = id;
    this._selectedCompetition.next(id);
  }

  onSeasonSelected(id) {
    gameState.season = id;
    this._selectedSeason.next(id);
  }

  onVenueSelected(id) {
    gameState.venue = id;
    this._selectedVenue.next(id);
  }

  onCreateGame(game) {
    this.sportHttpService.postGame(game).subscribe(res => {
      this.notificationService.showSuccess('Game had been created');
      this.router.navigateByUrl('sport/games/' + res.result + '/edit');
    });
  }

  onUpdateGame(game) {
    this.sportHttpService.putGame(game).subscribe(res => {
      this.notificationService.showSuccess('Game has been updated');
      // send updated values
    });
  }

  onDeleteGame(gameId) {
    this.sportHttpService.deleteGame(gameId).subscribe(res => {
      this.notificationService.showSuccess('Game has been deleted');
      // go after delete
    });
  }

  getSports(): Observable<any[]> {
    return this.sportHttpService.getSports()
      .map(data => this.sortFilterContentByName(data.result))
      .switchMap((entities: any[]) => {
        return this.mapToSelectItemObsList(entities, 'Sport');
      });
  }

  getLeaguesBySport(sportId: string = null): Observable<any[]> {
    if (sportId) {
      return this.sportHttpService.getLeagues(sportId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          return this.mapToSelectItemObsList(entities, 'League');
        });
    }
    return this.mapToSelectItemObsList([], 'League');
  }

  getConferencesByLeague(leagueId: string): Observable<any[]> {
    if (leagueId && leagueId !== '') {
      return this.sportHttpService.getConferencesByLeague(leagueId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          let conferences = [];
          conferences = [{ label: 'Select Conference', value: '' }];
          entities.forEach(e => {
            conferences.push({ label: e.name, value: e.id });
          });

          return Observable.of(conferences);
        });
    }
    return Observable.of([]);
  }

  getDivisionsByLeague(leagueId: string): Observable<any[]> {
    if (leagueId && leagueId !== '') {
      return this.sportHttpService.getDivisions(leagueId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          let divisions = [];
          divisions = [{ label: 'Select Division', value: '' }];
          entities.forEach(e => {
            divisions.push({ label: e.name, value: e.id });
          });

          return Observable.of(divisions);
        });
    }
    return Observable.of([]);
  }

  getTeamsByLeague(leagueId: string): Observable<any[]> {
    if (leagueId && leagueId !== '') {
      return this.sportHttpService.getTeamsByLeague(leagueId)
        .map(res => this.sortFilterContentByName(res.result));
    }
    return this.mapToSelectItemObsList([], 'Home Team');
  }

  getCompetitionsByLeagues(leagueId = ''): Observable<any[]> {
    if (leagueId && leagueId !== '') {
      return this.sportHttpService.getCompetitions(leagueId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          return this.mapToSelectItemObsList(entities, 'Competition');
        });
    }
    return this.mapToSelectItemObsList([], 'Competition');
  }

  getSeasonsByLeagues(leagueId = ''): Observable<any[]> {
    if (leagueId && leagueId !== '') {
      return this.sportHttpService.getSeasons(leagueId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          return this.mapToSelectItemObsList(entities, 'Season');
        });
    }
    return this.mapToSelectItemObsList([], 'Season');
  }

  getVenuesBySport(sportId) {
    if (sportId && sportId !== '') {
      return this.sportHttpService.getVenues(sportId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          return this.mapToSelectItemObsList(entities, 'Venue');
        });
    }
    return this.mapToSelectItemObsList([], 'Venue');
  }

  private loadLeagues(leagues) {
    this._leaguesList.next(leagues);
  }

  private loadTeams(teams) {
    this._homeTeamsList.next(this.mapToSelectItemList(teams, 'Home Team'));
    this._awayTeamsList.next(this.mapToSelectItemList(teams, 'Away Team'));
  }

  private loadCompetitions(competitions) {
    this._competitionsList.next(competitions);
  }

  private loadSeasons(seasons) {
    this._seasonsList.next(seasons);
  }

  private loadVenues(venues) {
    this._venuesList.next(venues);
  }

  private sortFilterContentByName(entities: any[]): any[] {
    return entities.sort((a, b) => {
      const A = (a.name || '').toLowerCase();
      const B = (b.name || '').toLowerCase();
      if (A < B) {
        return -1;
      } else if (A > B) {
        return  1;
      } else {
        return 0;
      }
    });
  }

  private mapToSelectItemObsList(entities: any[], type: string): Observable<SelectItem[]> {
    let result = [];
    result = [{ label: `Select ${type}`, value: '' }];
    entities.forEach(e => {
      result.push({ label: e.name, value: e.id });
    });

    return Observable.of(result);
  }

  private mapToSelectItemList(entities: any[], type: string): SelectItem[] {
    let result = [];
    result = [{ label: `Select ${type}`, value: '' }];
    entities.forEach(e => {
      result.push({ label: e.name, value: e.id });
    });

    return result;
  }

  private clearUnderLeagueState() {
    gameState.homeTeam = '';
    gameState.awayTeam = '';
    gameState.competition = '';
    gameState.season = '';

    this._selectedHomeTeam.next('');
    this._selectedAwayTeam.next('');
    this._selectedCompetition.next('');
    this._selectedSeason.next('');
  }
}
