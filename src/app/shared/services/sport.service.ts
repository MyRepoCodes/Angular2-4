import { Injectable } from '@angular/core';
import { ApiService } from '../api';
import { API_SPORTS_URL } from '../api';
import {
  API_LEAGUES_URL, leaguesBySportUrl, conferencesByLeague,
  conferencesByLeagueUrl
} from '../api';
import {
  divisionsByLeagueUrl, API_DIVISIONS_URL, API_TEAMS_SEARCH_URL,
  API_TEAMS_URL, teamsByDivisionUrl,
  teamsByConferencesUrl, seasonsByLeagueUrl, API_SEASONS_URL,
  venuesBySportUrl, API_VENUES_URL, competitionsByLeagueUrl,
  API_COMPETITIONS_URL, API_PLAYERS_URL, playerSearch,
  teamBySportUrl
} from '../api';
import { API_CONFERENCES_URL } from '../api';
import { Filter, createArrayParamFilter } from '../fitler';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import {
  searchLineupsForTeamInSeason, baseballGamePlayersByGameUrl,
  API_BASEBALL_GAME_PLAYERS_URL, baseballGamePlayersByPersonalDetailsAndTeams, playersByPersonalDetails,
  teamsByLeagueUrl, gameTrackerByIid, API_GAME_TRACKER_SEARCH_URL, API_GAMES_URL, API_POSITIONS_URL,
  actionsEventsByGameUrl, atbatsEventsByGameUrl, API_GAMES_SEARCH_URL
} from '../api/api.urls';

const API_CONFERENCES_SEARCH_URL = `${API_CONFERENCES_URL}/search`;
const API_DIVISIONS_SEARCH_URL = `${API_DIVISIONS_URL}/search`;
const API_TEAMS_SEARCH_BY_MULTIPLE_URL = '/Sport/api/teams/searchByMultipleParams';
const API_SEASONS_SEARCH_URL = `${API_SEASONS_URL}/search`;
const API_COMPETITIONS_SEARCH_URL = `${API_COMPETITIONS_URL}/search`;

type Page = { number: number, size: number };
const defaultPage: Page = { number: 1, size: 100 };

type CollectionResult = Observable<{ result: any[], totalRecords: number }>;
const emptyCollectionResult: CollectionResult = Observable.of({ result: [], totalRecords: 0 });

type Result = Observable<{ result: any }>;
// const emptyResult: Result = Observable.of({ result: null});

const emptyObservable: Observable<any> = Observable.of(null);

@Injectable()
export class HttpSportService {
  constructor(private api: ApiService) {
  }

  // sports
  public getSport(id): Result {
    return this.api.getEntityById(API_SPORTS_URL, id);
  }

  public postSport(sport): Observable<any> {
    return this.api.postEntity(API_SPORTS_URL, sport);
  }

  public putSport(sport): Observable<any> {
    return this.api.putEntity(API_SPORTS_URL, sport.id, sport);
  }

  public deleteSport(id): Observable<any> {
    return this.api.deleteEntity(API_SPORTS_URL, id);
  }

  public getSports(page: Page = defaultPage): CollectionResult {
    const search = Filter.fromPaging(page.number, page.size);
    return this.api.searchEntities(API_SPORTS_URL, search.getParams())
      .catch(err => emptyCollectionResult);
  }

  // leagues
  public getLeague(id): Observable<any> {
    return this.api.getEntityById(API_LEAGUES_URL, id)
      .catch(err => emptyObservable);
  }

  public postLeague(league): Observable<any> {
    return this.api.postEntity(API_LEAGUES_URL, league);
  }

  public putLeague(league): Observable<any> {
    return this.api.putEntity(API_LEAGUES_URL, league.id, league);
  }

  public deleteLeague(id): Observable<any> {
    return this.api.deleteEntity(API_LEAGUES_URL, id);
  }

  public getLeagues(sportId: string = null, page: Page = defaultPage): CollectionResult {
    if (sportId) {
      const search = Filter.fromPagingWithEntity(sportId, page.number, page.size);
      return this.api.searchEntities(leaguesBySportUrl(sportId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_LEAGUES_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  // conferences
  public getConference(id): Observable<any> {
    return this.api.getEntityById(API_CONFERENCES_URL, id)
      .catch(err => emptyObservable);
  }

  public postConference(conference): Observable<any> {
    return this.api.postEntity(API_CONFERENCES_URL, conference);
  }

  public putConference(conference): Observable<any> {
    return this.api.putEntity(API_CONFERENCES_URL, conference.id, conference);
  }

  public deleteConference(id): Observable<any> {
    return this.api.deleteEntity(API_CONFERENCES_URL, id);
  }

  public getConferences(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(conferencesByLeagueUrl(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_CONFERENCES_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  public getConferencesByLeague(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(conferencesByLeague(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_CONFERENCES_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  public getConferencesByLeagues(leagueIds: string[] = [], page: Page = defaultPage): CollectionResult {
    const leagues = createArrayParamFilter('leagueIds', leagueIds.length > 0 ? leagueIds : null);
    const search = Filter.fromPaging(page.number, page.size);
    search.optional = [leagues];
    return this.api.searchEntities(API_CONFERENCES_SEARCH_URL, search.getParams())
      .catch(err => emptyCollectionResult);
  }

  // divisions
  public getDivision(id): Observable<any> {
    return this.api.getEntityById(API_DIVISIONS_URL, id)
      .catch(err => emptyObservable);
  }

  public postDivision(division): Observable<any> {
    return this.api.postEntity(API_DIVISIONS_URL, division);
  }

  public putDivision(division): Observable<any> {
    return this.api.putEntity(API_DIVISIONS_URL, division.id, division);
  }

  public deleteDivision(id): Observable<any> {
    return this.api.deleteEntity(API_DIVISIONS_URL, id);
  }

  public getDivisions(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(divisionsByLeagueUrl(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_DIVISIONS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  public getDivisionByLeague(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(divisionsByLeagueUrl(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_TEAMS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  public getDivisionsByLeagues(leagueIds: string[] = [], page: Page = defaultPage) {
    const leagues = createArrayParamFilter('leagueIds', leagueIds.length > 0 ? leagueIds : null);
    const search = Filter.fromPaging(page.number, page.size);
    search.optional = [leagues];
    return this.api.searchEntities(API_DIVISIONS_SEARCH_URL, search.getParams())
      .catch(err => emptyCollectionResult);
  }

  // teams
  public getTeam(id): Observable<any> {
    return this.api.getEntityById(API_TEAMS_URL, id)
      .catch(err => emptyObservable);
  }

  public deleteTeam(id): Observable<any> {
    return this.api.deleteEntity(API_TEAMS_URL, id);
  }

  public postTeam(team): Observable<any> {
    return this.api.postEntity(API_TEAMS_URL, team);
  }

  public putTeam(team): Observable<any> {
    return this.api.putEntity(API_TEAMS_URL, team.id, team);
  }

  public getTeamsByLeague(leagueId, paging = null): Observable<any> {
    let filter;
    if (paging) {
      filter = Filter.fromPagination(paging);
    } else {
      filter = Filter.fromPaging(0, 500);
    }

    return this.searchTeams(teamsByLeagueUrl(leagueId), filter);
  }

  public getTeams(page: Page = defaultPage, divisionId: string = null, conferenceId: string = null): CollectionResult {
    if (divisionId) {
      const search = Filter.fromPagingWithEntity(divisionId, page.number, page.size);
      return this.api.searchEntities(teamsByDivisionUrl(divisionId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      if (conferenceId) {
        const search = Filter.fromPagingWithEntity(conferenceId, page.number, page.size);
        return this.api.searchEntities(teamsByConferencesUrl(conferenceId), search.getParams())
          .catch(err => emptyCollectionResult);
      } else {
        const search = Filter.fromPaging(page.number, page.size);
        return this.api.searchEntities(API_TEAMS_SEARCH_URL, search.getParams())
          .catch(err => emptyCollectionResult);
      }
    }

  }

  public getTeamsByMultipleParams(state): CollectionResult {
    const filter = Filter.createByType(state, 'teamsByMultipleParams', true);
    return this.searchTeams(API_TEAMS_SEARCH_BY_MULTIPLE_URL, filter);
  }

  private searchTeams(url, filter): CollectionResult {
    return this.api.searchEntities(url, filter.getParams())
      .mergeMap(res => {
        const totalRecords = res.totalRecords;
        const currentRecords = res.result.length;
        const teamQueries = [];
        if (currentRecords < totalRecords) {
          while ((filter.skip + currentRecords) < totalRecords) {
            filter.skip += filter.take;
            teamQueries.push(this.api.searchEntities(url, filter.getParams()));
          }
        } else {
          return Observable.of([]);
        }
        return Observable.forkJoin(teamQueries);
      }, (firstResult, restResults) => ({firstRes: firstResult, restRes: restResults}))
      .map(res => {
        const allTeams: any = res.firstRes;
        const restTeams: any[] = res.restRes;
        for (const oneCall of restTeams) {
          allTeams.errors.push(...oneCall.errors);
          allTeams.result.push(...oneCall.result);
        }
        return allTeams;
      })
      .catch(err => emptyCollectionResult);
  }

  // gameplayers
  public getLineupByGame(gameId): Observable<any> {
    if (gameId) {
      return this.api.searchEntities(baseballGamePlayersByGameUrl(gameId))
        .map(res => res.result)
        .catch(err => Observable.of([]));
    }
    return Observable.of([]);
  }

  public postGamePlayer(gamePlayer): Observable<any> {
    return this.api.postEntity(API_BASEBALL_GAME_PLAYERS_URL, gamePlayer);
  }

  public putGamePlayer(gamePlayer): Observable<any> {
    return this.api.putEntity(API_BASEBALL_GAME_PLAYERS_URL, gamePlayer.id, gamePlayer);
  }

  public deleteGamePlayer(gamePlayer): Observable<any> {
    return this.api.deleteEntity(API_BASEBALL_GAME_PLAYERS_URL, gamePlayer.id);
  }

  public getLineupsForTeamInSeason(seasonId, teamId): CollectionResult {
    if (seasonId && teamId) {
      return this.api.searchEntities(searchLineupsForTeamInSeason(seasonId, teamId))
        .catch(err => emptyCollectionResult);
    }
    return emptyCollectionResult;
  }

  public getGamePlayersByPersonalDetailsAndTeam(firstName, lastName, birthDate, teamId): Observable<any> {
    if (firstName && lastName && birthDate) {
      const params = new Map<string, string>();
      params.set('firstName', firstName);
      params.set('lastName', lastName);
      params.set('birthDate', birthDate);
      const playerRequest = this.api.searchEntities(playersByPersonalDetails, params);
      params.set('teamId', teamId);
      const gamePlayerRequest = this.api.searchEntities(baseballGamePlayersByPersonalDetailsAndTeams, params);

      return Observable.forkJoin([
        playerRequest,
        gamePlayerRequest
      ]);
    }
    return Observable.of([]);
  }

  // action events
  public getActionEventsByGame(gameId): CollectionResult {
    const url = actionsEventsByGameUrl(gameId);
    return this.api.searchEntities(url)
      .catch(err => emptyCollectionResult);
  }

  // atbat events
  public getAtbatEventsByGame(gameId): CollectionResult {
    const url = atbatsEventsByGameUrl(gameId);
    return this.api.searchEntities(url)
      .catch(err => emptyCollectionResult);
  }

  // seasons
  public getSeasons(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(seasonsByLeagueUrl(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_SEASONS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }
  public getSeason(id): Observable<any> {
    return this.api.getEntityById(API_SEASONS_URL, id)
      .catch(err => emptyObservable);
  }
  public deleteSeason(id): Observable<any> {
    return this.api.deleteEntity(API_SEASONS_URL, id);
  }
  public postSeason(team): Observable<any> {
    return this.api.postEntity(API_SEASONS_URL, team);
  }
  public putSeason(team): Observable<any> {
    return this.api.putEntity(API_SEASONS_URL, team.id, team);
  }

  public getSeasonsByLeagues(leagueIds: string[] = [], page: Page = defaultPage): CollectionResult {
    const leagues = createArrayParamFilter('leagueIds', leagueIds.length > 0 ? leagueIds : null);
    const search = Filter.fromPaging(page.number, page.size);
    search.optional = [leagues];
    return this.api.searchEntities(API_SEASONS_SEARCH_URL, search.getParams())
      .catch(err => emptyCollectionResult);
  }

  // venues
  public getVenues(sportId: string = null, page: Page = defaultPage): CollectionResult {
    if (sportId) {
      const search = Filter.fromPagingWithEntity(sportId, page.number, page.size);
      return this.api.searchEntities(venuesBySportUrl(sportId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_VENUES_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }
  public getVenue(id): Observable<any> {
    return this.api.getEntityById(API_VENUES_URL, id)
      .catch(err => emptyObservable);
  }
  public deleteVenue(id): Observable<any> {
    return this.api.deleteEntity(API_VENUES_URL, id);
  }
  public postVenue(team): Observable<any> {
    return this.api.postEntity(API_VENUES_URL, team);
  }
  public putVenue(team): Observable<any> {
    return this.api.putEntity(API_VENUES_URL, team.id, team);
  }

  // competitions
  public getCompetitions(leagueId: string = null, page: Page = defaultPage): CollectionResult {
    if (leagueId) {
      const search = Filter.fromPagingWithEntity(leagueId, page.number, page.size);
      return this.api.searchEntities(competitionsByLeagueUrl(leagueId), search.getParams())
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_COMPETITIONS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }
  public getCompetition(id): Observable<any> {
    return this.api.getEntityById(API_COMPETITIONS_URL, id)
      .catch(err => emptyObservable);
  }
  public deleteCompetition(id): Observable<any> {
    return this.api.deleteEntity(API_COMPETITIONS_URL, id);
  }
  public postCompetition(competition): Observable<any> {
    return this.api.postEntity(API_COMPETITIONS_URL, competition);
  }
  public putCompetition(competition): Observable<any> {
    return this.api.putEntity(API_COMPETITIONS_URL, competition.id, competition);
  }

  public getCompetitionsByLeagues(leagueIds: string[] = [], page: Page = defaultPage): CollectionResult {
    const leagues = createArrayParamFilter('leagueIds', leagueIds.length > 0 ? leagueIds : null);
    const search = Filter.fromPaging(page.number, page.size);
    search.optional = [leagues];
    return this.api.searchEntities(API_COMPETITIONS_SEARCH_URL, search.getParams())
      .catch(err => emptyCollectionResult);
  }

  // players
  public getPlayers(sportId: string = null, name: string = null, page: Page = defaultPage): CollectionResult {
    if (sportId || name) {
      const search = Filter.fromPaging(page.number, page.size);
      const params = new Map<string, any>();
      params.set('name', name);
      params.set('sportId', sportId);
      params.set('take', search.take);
      params.set('skip', search.skip);
      return this.api.searchEntities(playerSearch, params)
        .catch(err => emptyCollectionResult);
    }else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_PLAYERS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }

  public getTeamBySport(sportId: string = null, page: Page = defaultPage): CollectionResult {
    if (sportId) {
      const search = Filter.fromPagingWithEntity(sportId, page.number, page.size);
      const fltr = { paging: { page: page.number, size: page.size } };
      const filter = Filter.createByType(fltr, 'sport');
      return this.api.searchEntities(teamBySportUrl(sportId), search.getParams())
        .mergeMap(res => {
          const totalRecords = res.totalRecords;
          const currentRecords = res.result.length;
          const teamQueries = [];
          if (currentRecords < totalRecords) {
            while ((filter.skip + currentRecords) < totalRecords) {
              filter.skip += 100;
              teamQueries.push(this.api.searchEntities(teamBySportUrl(sportId), filter.getParams()));
            }
          } else {
            return Observable.of([]);
          }
          return Observable.forkJoin(teamQueries);
        }, (firstResult, restResults) => ({ firstRes: firstResult, restRes: restResults }))
        .map(res => {
          const allTeams: any = res.firstRes;
          const restTeams: any[] = res.restRes;
          for (const oneCall of restTeams) {
            allTeams.errors.push(...oneCall.errors);
            allTeams.result.push(...oneCall.result);
          }
          allTeams.result = this.sortFilterContentByName(allTeams.result);
          return allTeams;
        })
        .catch(err => emptyCollectionResult);
    } else {
      const search = Filter.fromPaging(page.number, page.size);
      return this.api.searchEntities(API_SPORTS_URL, search.getParams())
        .catch(err => emptyCollectionResult);
    }
  }
  public getPlayer(id): Observable<any> {
    return this.api.getEntityById(API_PLAYERS_URL, id)
      .catch(err => emptyObservable);
  }
  public deletePlayer(id): Observable<any> {
    return this.api.deleteEntity(API_PLAYERS_URL, id);
  }
  public postPlayer(player): Observable<any> {
    return this.api.postEntity(API_PLAYERS_URL, this.bindGameTypeApi(player));
  }
  public putPlayer(player): Observable<any> {
    return this.api.putEntity(API_PLAYERS_URL, player.id, this.bindGameTypeApi(player));
  }

  public bindGameTypeApi(player: any) {
    return Object.assign({}, { '$type': 'Synergy.Model.Api.Sport.BaseballPlayer, Synergy.Model.Api' }, player);
  }
  public sortFilterContentByName(entities: any[]): any[] {
    return entities.sort((a, b) => {
      const A = (a.name || '').toLowerCase();
      const B = (b.name || '').toLowerCase();
      if (A < B) {
        return -1;
      } else if (A > B) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // game-trackers
  public searchGameTrackers(state): CollectionResult {
    const filter = Filter.createByType(state, 'gameTrackers');
    return this.api.searchEntities(API_GAME_TRACKER_SEARCH_URL, filter.getParams())
      .catch(err => emptyCollectionResult);
  }

  public getGameTrackerByIid(iid: number): Result {
    return this.api.searchEntities(gameTrackerByIid(iid))
      .map(result => {
        if (result.result) {
          return { result: [result.result], totalRecords: 1};
        } else {
          return { result: [], totalRecords: 0};
        }
      })
      .catch(err => emptyObservable);
  }

  // games
  public getGameById(gameId: string): Result {
    return this.api.getEntityById(API_GAMES_URL, gameId);
  }

  public getGameByIid(gameIid): Result {
    const params = new Map<string, string>();
    params.set('iid', gameIid);
    return this.api.searchEntities(API_GAMES_SEARCH_URL, params);
  }

  public postGame(game) {
    return this.api.postEntity(API_GAMES_URL, this.setGameApiTypeProperty(game));
  }
  public putGame(game) {
    return this.api.putEntity(API_GAMES_URL, game.id, this.setGameApiTypeProperty(game));
  }
  public deleteGame(gameId) {
    return this.api.deleteEntity(API_GAMES_URL, gameId)
      .map(result => {
        return { result: result.result };
      })
      .catch(err => {
        return [{error: err}];
      });
  }

  private setGameApiTypeProperty(game: any) {
    // todo: for now we support only Baseball games
    // in feature we'll need set this $type by sport (Baseball, Basketball, Hokey)
    return Object.assign({}, { '$type': 'Synergy.Model.Api.Sport.Baseball.BaseballGame, Synergy.Model.Api' }, game);
  }

  getPositions() {
    return this.api.searchEntities(API_POSITIONS_URL).map(result => {
      return result.result;
    }).catch(err => Observable.of([]));
  }
}
