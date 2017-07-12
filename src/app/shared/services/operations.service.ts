import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ApiService } from '../api';
import { Filter } from '../fitler';
import { LoggerMapping } from '../../admin/loggers-mapping/entities';
import {
  API_JOBS_URL, API_JOBS_BULK_URL, jobsByGameUrl,
  API_USERS_LOGGERS_URL, API_USERS_ADMINS_URL, API_SERVERS_URL
} from '../api/api.urls';

type Paging = { page: number, size: number };
type Result = Observable<{ result: any[], totalRecords: number }>;
type Response = Observable<{ result: any, errors: string[], failed: boolean }>;
type ListResult = Observable<any[]>;

@Injectable()
export class OperationsHttpService {

  private static TAG_SUMMARIES = '/operations/api/tagsummaries';
  private static TRAINEE_GAMES = '/operations/api/tagsummaries/games';
  private static LOGGERS_TRAINEES = '/operations/api/loggers/trainees';
  private static LOGGER_MAPPINGS = '/operations/api/users/loggers-mapping';
  private static GAMES = '/operations/api/games';
  private static API_GAME_TRACKER_URL = '/Operations/api/game-trackers';
  // private static API_GAME_TRACKER_SEARCH_URL = `${OperationsHttpService.API_GAME_TRACKER_URL}/search`;

  private emptyResult: Result = Observable.of({ result: [], totalRecords: 0 });
  private emptyListResult: ListResult = Observable.of([]);

  private static tagSummariesByUserIdAndGameIdUrl =
    (userId, gameId) => `${OperationsHttpService.TAG_SUMMARIES}/users/${userId}/games/${gameId}`;
  private static tagSummariesByGameUrl =
    (gameId, isTrainingGame = true) => `${OperationsHttpService.TAG_SUMMARIES}/games/${gameId}/${isTrainingGame}`;
  private static gameByIdUrl = gameId => `${OperationsHttpService.GAMES}/${gameId}`;
  private static missionByGameIdUrl = gameId => `${OperationsHttpService.gameByIdUrl(gameId)}/missions`;
  // private static gameTrackerById = id => `${OperationsHttpService.API_GAME_TRACKER_URL}/${id}`;
  // private static gameTrackerByIid = iid => `${OperationsHttpService.API_GAME_TRACKER_URL}/${iid}`;

  constructor(private api: ApiService) {
  }

  public getTagSummariesByUserIdAndGameId(userId, missionId, gameId, phase, start, end, paging): Result {
    const url = OperationsHttpService.tagSummariesByUserIdAndGameIdUrl(userId, gameId);
    const filter = Filter.fromPaging(paging.page, paging.size);
    filter.add('missionId', missionId);
    filter.add('phase', phase);
    filter.add('start', start);
    filter.add('end', end);

    return this.api.searchEntities(url, filter.getParams())
      .map(result => result)
      .catch(err => this.emptyResult);
  }

  public getTagSummariesByGame(gameId, phase, isTraining, paging: Paging): Result {
    const url = OperationsHttpService.tagSummariesByGameUrl(gameId, isTraining);
    const filter = Filter.fromPaging(paging.page, paging.size);
    filter.add('phase', phase);

    return this.api.searchEntities(url, filter.getParams())
      .map(result => result)
      .catch(err => this.emptyResult);
  }

  // Trainees
  public getLoggersTrainees(paging: Paging): ListResult {
    const url = OperationsHttpService.LOGGERS_TRAINEES;
    const filter = Filter.fromPaging(paging.page, paging.size);

    return this.api.searchEntities(url, filter.getParams())
      .catch(err => this.emptyListResult);
  }

  // Trainees Games
  public getGamesForTrainee(traineeId: string): ListResult {
    const filter = Filter.create();
    if (traineeId) {
      filter.add('userId', traineeId);
    }

    return this.api.searchEntities(OperationsHttpService.TRAINEE_GAMES, filter.getParams())
      .catch(err => this.emptyListResult);
  }

  // Loggers Mapping
  public getLoggerMappings(searchParams): Result {
    let url = OperationsHttpService.LOGGER_MAPPINGS;
    const filter = Filter.fromPaging(searchParams.page, searchParams.size);

    if (searchParams.searchText) {
      url += '/search/' + searchParams.searchText;
    }

    return this.api.searchEntities(url, filter.getParams())
      .map(res => {
        res.result = res.result.map(item => new LoggerMapping(item));
        return res;
      })
      .catch(err => this.emptyResult);
  }

  public postLoggerMapping(item: LoggerMapping) {
    return this.api.postEntity(OperationsHttpService.LOGGER_MAPPINGS, item);
  }

  public putLoggerMapping(item: LoggerMapping) {
    return this.api.putEntity(OperationsHttpService.LOGGER_MAPPINGS, item.id, item);
  }

  // Jobs
  public getJobsByGame(gameId): ListResult {
    return this.api.searchEntities(jobsByGameUrl(gameId))
      .map(res => res.result)
      .catch(err => this.emptyListResult);
  }

  public postJob(item): Response {
    return this.api.postEntity(API_JOBS_URL, item);
  }

  public putJob(jobId, item): Response {
    return this.api.putEntity(API_JOBS_URL, jobId, item);
  }

  public bulkJobs(params): Response {
    return this.api.postEntity(API_JOBS_BULK_URL, params);
  }

  public getLoggers(): ListResult {
    return this.api.searchEntities(API_USERS_LOGGERS_URL);
  }

  public getAdmins(): ListResult {
    return this.api.searchEntities(API_USERS_ADMINS_URL);
  }

  // Containers
  public getServers(): ListResult {
    return this.api.searchEntities(API_SERVERS_URL);
  }

  // Missions
  public postMission(gameId: string, mission: any): Response {
    const url = OperationsHttpService.missionByGameIdUrl(gameId);
    return this.api.postEntity(url, mission);
  }

  // GameTracker
  getGameTracker(id) {
    return this.api.getEntityById(OperationsHttpService.API_GAME_TRACKER_URL, id)
      .map(res => res.result);
  }

  // postGameTracker(gameId, gameTracker): Response {
  //   const url = OperationsHttpService.gameTrackerById(gameId);
  //   return this.api.postEntity(url, gameTracker);
  // }

  putGameTracker(gameId, gameTracker): Response {
    return this.api.putEntity(OperationsHttpService.API_GAME_TRACKER_URL, gameId, gameTracker);
  }
}
