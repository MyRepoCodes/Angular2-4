import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OperationsHttpService } from '../../shared/services';
import { CompareTool } from './comparator';
import * as moment from 'moment';
import { AppSettingsService } from '../../shared/app-settings.service';
import { NotificationService } from '../../shared/services/notification.service';

type QueryType = 'trainee' | 'correct';

@Component({
  selector: 'sn-compare-tool',
  templateUrl: 'compare-tool.component.html'
})
export class CompareToolComponent implements OnInit, OnDestroy {
  params: any = {};
  data: any = [];
  trainees: any[] = [];
  trainee: any;
  traineesItems: any[];
  selectedTrainee: string;
  games: any[] = [];
  gameItems: any[];
  selectedGame: string;
  progress = '';
  videoUrl: string;
  phases: any[];
  loading = false;

  assetId: string;
  videoDisplay = false;

  videoDialogHeader = 'Video Player';

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private operationsService: OperationsHttpService,
    private settings: AppSettingsService,
    private notifications: NotificationService
  ) {
    this.phases = [
      {label: 'All', value: null},
      {label: 'Enter Level 1 Events', value: 'Enter Level 1 Events'},
      {label: 'Enter Level 2 Events', value: 'Enter Level 2 Events'},
      {label: 'Enter Level 3 Events', value: 'Enter Level 3 Events'},
    ];
  }

  ngOnInit() {
    this.progress = 'Search not started.';
    this.sub = this.route.params
      .subscribe(params => {
        this.params = { userId: params['userId'], gameId: params['gameId'], missionId: params['missionId'] };

        this.operationsService.getLoggersTrainees({page: 1, size: 512})
          .subscribe(res => {
            this.trainees = res;
            this.traineesItems = this.mapTraineesToSelectItem(res);

            if (this.params.userId) {
              const trainee = res.filter(x => x.userId === this.params.userId)[0];
              if (!!trainee) {
                this.trainee = trainee;
                this.selectedTrainee =  this.params.userId;
                this.loadGames(trainee.desiId);
                if (this.params.gameId && this.params.missionId) {
                  this.selectedGame = `${this.params.gameId}_${this.params.missionId}`;
                  this.compare(trainee, this.params.gameId, this.params.missionId);
                }
              }
            }
          });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  hideVideoDialog() {}

  compare(trainee: any, gameId: string, missionId: string) {
    this.progress = 'Loading...';
    const firstPage = {page: 1, size: 100};
    this.operationsService.getTagSummariesByUserIdAndGameId(
      trainee.desiId,
      missionId,
      gameId,
      trainee.phase,
      trainee.startDate,
      trainee.endDate,
      firstPage
    ).do(() => this.loading = true)
      .mergeMap( // correct data (first 100 rows)
        _ => this.operationsService.getTagSummariesByGame(gameId, trainee.phase, false, firstPage),
        (traineeResult, correctResult) => ({
          firstTraineeResult: traineeResult,
          firstCorrectResult: correctResult
        })
      )
      .mergeMap(res => {
        const params = {
          userId: trainee.userId, missionId: missionId, gameId: gameId,
          start: trainee.startDate, end: trainee.endDate, phase: trainee.phase
        };

        const traineeQueries = this.createQueries(firstPage, res.firstTraineeResult.totalRecords, params, 'trainee');
        const correctQueries = this.createQueries(firstPage, res.firstCorrectResult.totalRecords, params, 'correct');

        return this.getRestData(traineeQueries, correctQueries);
      }, (res, restResults) => ({
        firstTraineeResult: res.firstTraineeResult,
        firstCorrectResult: res.firstCorrectResult,
        restTraineeResult: restResults.restTraineeResult,
        restCorrectResult: restResults.restCorrectResult
      }))
      .subscribe(res => {
        this.progress = 'Compare Data ...';
        const traineeData = this.prepareData(res.firstTraineeResult.result, res.restTraineeResult);
        const correctData = this.prepareData(res.firstCorrectResult.result, res.restCorrectResult);

        const compareTool = new CompareTool();
        const tmp = compareTool.compare(traineeData, correctData);
        // check for null
        if (res.firstCorrectResult && res.firstCorrectResult.result[0]) {
          this.assetId = res.firstCorrectResult.result[0].assetId;
        }
        this.data = this.addInfoForCvsReport(tmp);
        this.progress = '';
        this.videoUrl = `http://usbellodsworker01wan.synergy.aware.net:8585/hls/${this.assetId}/asset.m3u8`;
        this.loading = false;
      }, err => {
        this.loading = false;
        this.notifications.showError('Error', 'Cannot load data', 3);
      });
  }

  traineeSelected(traineeId) {
    this.selectedTrainee = traineeId;
    this.params.userId = traineeId;
    const trainee = this.trainees.filter(x => x.userId === traineeId)[0];
    if (!!trainee) {
      this.trainee = trainee;
      this.loadGames(trainee.desiId);
    }
  }

  linkToVideo(spValue) {
    return `${this.settings.videoBaseUrl()}/cp-videoplayer?assetId=${this.assetId}&seek=${spValue / 1000}`;
  }

  gameSelected(gameId) {
    this.selectedGame = gameId;
    const splited = gameId.split('_');
    this.params.gameId = splited[0];
    this.params.missionId = splited[1];
  }

  loadGames(userId: string): void {
    this.operationsService.getGamesForTrainee(userId)
      .subscribe(res => {
        this.games = res;
        this.gameItems = this.mapGamesToSelectItem(res);
      });
  }

  mapTraineesToSelectItem(items: any[]): { label: string, value: string }[] {
    const x = [{ label: 'Select Trainee', value: ''}];
    const xs = items.map(e => ({ label: e.name, value: e.userId }));
    return x.concat(xs);
  }
  mapGamesToSelectItem(items: any[]): { label: string, value: string }[] {
    const x = [{ label: 'Select Game', value: ''}];
    const xs = items.map(e => ({ label: this.getGameName(e), value: this.getGameId(e) }));
    return x.concat(xs);
  }

  getStreamPosition(d): number {
    let spValue = 0;
    if (d.correct) {
      const c = d.correct;
      if (c.spValue) {
        spValue = c.spValue;
      } else if (d.trainee) {
        spValue = d.trainee.spValue || 0;
      }
    }
    return spValue;
  }

  private getGameName(game) {
    const home = game.homeTeamAbbr || 'noname';
    const away = game.awayTeamAbbr || 'noname';
    const mission = game.missionName || 'noname';
    return `${home}@${away} | Mission: ${mission}`;
  }

  private  getGameId(game) {
    return `${game.gameId}_${game.missionId}`;
  }

  private getRestData(traineeQueries, correctQueries): Observable<{restTraineeResult: any[], restCorrectResult: any[]}> {
    if (traineeQueries.length) {
      return Observable.forkJoin(traineeQueries)
        .mergeMap(
          () => {
            if (correctQueries.length) {
              return Observable.forkJoin(correctQueries);
            } else {
              return Observable.of([]);
            }
          },
          (traineeResult, correctResult) => ({restTraineeResult: traineeResult, restCorrectResult: correctResult})
        );
    } else if (correctQueries.length) {
      return Observable.forkJoin(correctQueries)
        .mergeMap(
          () => {
            if (traineeQueries.length) {
              return Observable.forkJoin(traineeQueries);
            } else {
              return Observable.of([]);
            }
          },
          (correctResult, traineeResult) => ({restTraineeResult: traineeResult, restCorrectResult: correctResult})
        );
    } else {
      return Observable.of({restTraineeResult: [], restCorrectResult: []});
    }
  }

  private createQueries(startPage, total: number, params: any, type: QueryType) {
    const queries = [];
    let np = this.getNextPage(startPage);
    while (this.hasRecords(np, total)) {
      if (type === 'trainee') {
        queries.push(this.operationsService
          .getTagSummariesByUserIdAndGameId(
            params.userId, params.missionId, params.gameId,
            params.phase, params.start, params.end,
            Object.assign({}, np)
          )
        );
      }
      if (type === 'correct') {
        queries.push(this.operationsService.getTagSummariesByGame(params.gameId, params.phase, false, Object.assign({}, np)));
      }

      np = this.getNextPage(np);
    }
    return queries;
  }

  private prepareData(firstResult, restResults: any[]) {
    let result = firstResult;

    for (let i = 0; i < restResults.length; i++) {
      result = result.concat(restResults[i]['result']);
    }

    result = result.map(elem => ({
      time: elem.streamPosition,
      streamPosition: moment.duration(elem.streamPosition),
      spValue: moment.duration(elem.streamPosition).asMilliseconds(),
      summary: this.parse(elem.summary)
    }));

    return result;
  }

  private parse(str: string) {
    if (str) {
      return str.split('>').map(s => s.trim());
    } else {
      return [];
    }
  }

  private getNextPage(page) {
    return {page: page.page + 1, size: page.size};
  }

  private hasRecords(page, total) {
    return ((page.page - 1) * page.size) < total;
  }

  private addInfoForCvsReport(data) {
    for (const d of data) {
      d.timeStr = this.getTimeStr(d);
      d.traineeStr = this.getSummaryStr(d.trainee);
      d.correctStr = this.getSummaryStr(d.correct);
      d.notesStr = this.getMissingStr(d.missed);
      d.urlStr = this.linkToVideo(this.getStreamPosition(d));
    }

    return data;
  }

  private getTimeStr(d) {
    let t = '';
    let c = '';
    if (d.trainee) {
      t = d.trainee.time;
    }
    if (d.correct) {
      c = d.correct.time;
    }

    return `Trainee Time: ${t || 'none'} Correct Time: ${c || 'none'}`;
  }

  private getSummaryStr(d) {
    if (d && d.summary) {
      return d.summary.join(' > ');
    }
    return '';
  }

  private getMissingStr(d) {
    if (d && d.missed) {
      return d.missed.join(' ; ');
    }
    return '';
  }
}
