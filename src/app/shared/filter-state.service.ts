import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class FilterStateService {
  public static SPORT_ID = 'sportId';
  public static LEAGUE_ID = 'leagueIds';
  public static COMPETITION_ID = 'competitionIds';
  public static CONFERENCE_ID = 'conferenceIds';
  public static DIVISION_ID = 'divisionIds';
  public static VENUE_ID = 'venueId';
  public static TEAM_ID = 'teamIds';
  public static SEASON_ID = 'seasonIds';
  public static JOB_TYPE_ID = 'jobTypeId';
  public static JOB_STATUS_ID = 'jobStatusIds';
  public static LINEUP_ID = 'lineupId';
  /*public static P1LOGGER = 'p1LoggerIds';
  public static P2LOGGER = 'p2LoggerIds';
  public static P3LOGGER = 'p3LoggerIds';
  public static HOME_TEAM_ID = 'homeTeamIds';
  public static AWAY_TEAM_ID = 'awayTeamIds';
  public static SERVER = 'serverIds';*/

  private state = {};
  private queryParams = {};
  private currentUrl = '';

  public constructor(private router: Router) {
    this.processUrl(router.url); // use this call to set initial state
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.processUrl(e.url);
      }
    });
  }

  private processUrl(url: string) {
    let position = url.indexOf('?');
    if (position === -1) {
      position = 9999999;
    }
    this.currentUrl = url.substring(0, position);
    this.queryParams = this.router.parseUrl(url).queryParams;
  }

  public storeId(key: string, id: string) {
    this.state[key] = id;
    this.queryParams[key] = id;
    this.router.navigate([this.currentUrl], {queryParams: this.queryParams });
  }

  public getId(key: string): string {
    return this.queryParams[key] || this.state[key];
  }

  public set sportId(id: string) {
    this.storeId(FilterStateService.SPORT_ID, id);
  }

  public get sportId(): string {
    return this.getId(FilterStateService.SPORT_ID);
  }

  public set leagueId(id: string) {
    this.storeId(FilterStateService.LEAGUE_ID, id);
  }

  public get leagueId(): string {
    return this.getId(FilterStateService.LEAGUE_ID);
  }

  public set competitionId(id: string) {
    this.storeId(FilterStateService.COMPETITION_ID, id);
  }

  public get competitionId(): string {
    return this.getId(FilterStateService.COMPETITION_ID);
  }

  public set conferenceId(id: string) {
    this.storeId(FilterStateService.CONFERENCE_ID, id);
  }

  public get conferenceId(): string {
    return this.getId(FilterStateService.CONFERENCE_ID);
  }

  public set divisionId(id: string) {
    this.storeId(FilterStateService.DIVISION_ID, id);
  }

  public get divisionId(): string {
    return this.getId(FilterStateService.DIVISION_ID);
  }

  public set venueId(id: string) {
    this.storeId(FilterStateService.VENUE_ID, id);
  }

  public get venueId(): string {
    return this.getId(FilterStateService.VENUE_ID);
  }

}
