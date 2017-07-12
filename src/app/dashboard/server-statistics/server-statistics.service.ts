import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../shared/api/api.service';
import {
  dashboardDataCentersByLeague, dashboardDataCenters, dashboardServersByDataCenter, dashboardGamesByServer,
  dashboardServersByDataCenterAndLeague, dashboardGamesByServerAndLeague
} from '../../shared/api/api.urls';

@Injectable()
export class ServerStatisticsService {

  constructor(private api: ApiService) {
  }

  public loadDataCenters(leagueId): Observable<any[]> {
    if (leagueId) {
      return this.api.searchEntities(dashboardDataCentersByLeague(leagueId))
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankDataCenters(entities));
        })
        .catch(err => Observable.of([]));
    } else {
      return this.api.searchEntities(dashboardDataCenters)
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankDataCenters(entities));
        })
        .catch(err => Observable.of([]));
    }
  }

  public loadServersByDataCenter(dataCenter, leagueId): Observable<any[]> {
    if (dataCenter.trim() === '') {
      dataCenter = null;
    }
    if (leagueId) {
      return this.api.searchEntities(dashboardServersByDataCenterAndLeague(dataCenter, leagueId))
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankServers(entities));
        })
        .catch(err => Observable.of([]));
    } else {
      return this.api.searchEntities(dashboardServersByDataCenter(dataCenter))
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankServers(entities));
        })
        .catch(err => Observable.of([]));
    }
  }

  public loadGamesByServer(server, leagueId): Observable<any[]> {
    if (server.trim() === '') {
      server = null;
    }
    if (leagueId) {
      return this.api.searchEntities(dashboardGamesByServerAndLeague(server, leagueId))
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankGames(entities));
        })
        .catch(err => Observable.of([]));
    } else {
      return this.api.searchEntities(dashboardGamesByServer(server))
        .map(res => res)
        .switchMap((entities: any[]) => {
          return Observable.of(this.rankGames(entities));
        })
        .catch(err => Observable.of([]));
    }
  }

  private rankDataCenters(entities) {
    const containers = [];
    let tvEncodingTotal = 0;
    let gamesUploadingTotal = 0;
    let uploadCompleteTotal = 0;
    let readyToEncodeTotal = 0;
    let encodingTotal = 0;
    let readyToP0QaTotal = 0;
    let readyToP1Total = 0;
    let p1InProgressTotal = 0;
    let needsPbpTotal = 0;
    let readyToP2Total = 0;
    let p2InProgressTotal = 0;
    let triggersTotal = 0;

    entities.forEach(e => {

      tvEncodingTotal += !(e.tvEncoding) ? 0 : e.tvEncoding;
      gamesUploadingTotal += !(e.gamesUploading) ? 0 : e.gamesUploading;
      uploadCompleteTotal += !(e.uploadComplete) ? 0 : e.uploadComplete;
      readyToEncodeTotal += !(e.readyToEncode) ? 0 : e.readyToEncode;
      encodingTotal += !(e.encoding) ? 0 : e.encoding;
      readyToP0QaTotal += !(e.readyToPoQa) ? 0 : e.readyToPoQa;
      readyToP1Total += !(e.readyToP1) ? 0 : e.readyToP1;
      p1InProgressTotal += !(e.p1InProgress) ? 0 : e.p1InProgress;
      needsPbpTotal += !(e.needsPbp) ? 0 : e.needsPbp;
      readyToP2Total += !(e.readyToP2) ? 0 : e.readyToP2;
      p2InProgressTotal += !(e.p2InProgress) ? 0 : e.p2InProgress;
      triggersTotal += !(e.triggers) ? 0 : e.triggers;

      const dataCenterContainer = {
        data: {
          ServerName: !(e.name) ? '' : e.name,
          type: 'dataCenter',
          TvEncoding: !(e.tvEncoding) ? 0 : e.tvEncoding,
          GamesUploading: !(e.gamesUploading) ? 0 : e.gamesUploading,
          UploadComplete: !(e.uploadComplete) ? 0 : e.uploadComplete,
          ReadyToEncode: !(e.readyToEncode) ? 0 : e.readyToEncode,
          Encoding: !(e.encoding) ? 0 : e.encoding,
          ReadyToP0Qa: !(e.readyToPoQa) ? 0 : e.readyToPoQa,
          ReadyToP1: !(e.readyToP1) ? 0 : e.readyToP1,
          P1InProgress: !(e.p1InProgress) ? 0 : e.p1InProgress,
          NeedsPbp: !(e.needsPbp) ? 0 : e.needsPbp,
          ReadyToP2: !(e.readyToP2) ? 0 : e.readyToP2,
          P2InProgress: !(e.p2InProgress) ? 0 : e.p2InProgress,
          Triggers: !(e.triggers) ? 0 : e.triggers },
        leaf: false,
        children: []
      };
      containers.push(dataCenterContainer);
    });

    let totals: any;
    totals = {
      label: 'Totals',
      data: {
        ServerName: 'Totals',
        type: 'dataCenter',
        TvEncoding: tvEncodingTotal,
        GamesUploading: gamesUploadingTotal,
        UploadComplete: uploadCompleteTotal,
        ReadyToEncode: readyToEncodeTotal,
        Encoding: encodingTotal,
        ReadyToP0Qa: readyToP0QaTotal,
        ReadyToP1: readyToP1Total,
        P1InProgress: p1InProgressTotal,
        NeedsPbp: needsPbpTotal,
        ReadyToP2: readyToP2Total,
        P2InProgress: p2InProgressTotal,
        Triggers: triggersTotal
      }
    };
    containers.unshift(totals);

    return containers;
  }

  private rankServers(entities) {
    const containers = [];
    entities.forEach(e => {
      const server = {
        data: {
          ServerName: !(e.name) ? '' : e.name,
          type: 'server',
          TvEncoding: !(e.tvEncoding) ? 0 : e.tvEncoding,
          GamesUploading: !(e.gamesUploading) ? 0 : e.gamesUploading,
          UploadComplete: !(e.uploadComplete) ? 0 : e.uploadComplete,
          ReadyToEncode: !(e.readyToEncode) ? 0 : e.readyToEncode,
          Encoding: !(e.encoding) ? 0 : e.encoding,
          ReadyToP0Qa: !(e.readyToPoQa) ? 0 : e.readyToPoQa,
          ReadyToP1: !(e.readyToP1) ? 0 : e.readyToP1,
          P1InProgress: !(e.p1InProgress) ? 0 : e.p1InProgress,
          NeedsPbp: !(e.needsPbp) ? 0 : e.needsPbp,
          ReadyToP2: !(e.readyToP2) ? 0 : e.readyToP2,
          P2InProgress: !(e.p2InProgress) ? 0 : e.p2InProgress,
          Triggers: !(e.triggers) ? 0 : e.triggers },
        leaf: false,
        children: []
      };
      containers.push(server);
    });

    return containers;
  }

  private rankGames(entities) {
    const containers = [];
    entities.forEach(e => {
      const game = {
        data: {
          ServerName: e.iid + ' ' + e.name, TvEncoding: '', GamesUploading: '', UploadComplete: '',
          ReadyToEncode: '', Encoding: '', ReadyToP0Qa: '', ReadyToP1: '', P1InProgress: '', NeedsPbp: '',
          ReadyToP2: '', P2InProgress: '',  Triggers: ''}
      };
      containers.push(game);
    });

    return containers;
  }
}

