import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectItem } from 'primeng/primeng';
import { HttpSportService } from '../shared/services/sport.service';
import { initialPagingState, Paging } from '../shared/reducers/paging.reducer';
import * as moment from 'moment';

interface Sorting {
  field: string;
  order: string;
}

interface FilterState {
  sport: string;
  leagues: string[];
  conferences: string[];
  divisions: string[];
  teams: string[];
  competitions: string[];
  seasons: string[];
  jobType: string;
  jobStatuses: string[];
  lineup: string;
  gameOwner: string;
  videoSources: string[];
  from: string;
  to: string;
  dateInterval: string;
  paging: Paging;
  sort: Sorting;
}

const initialFilterState = {
  sport: '',
  leagues: [],
  conferences: [],
  divisions: [],
  teams: [],
  competitions: [],
  seasons: [],
  jobType: '',
  jobStatuses: [],
  lineup: '',
  gameOwner: '',
  videoSources: [],
  from: new Date(),
  to: new Date(),
  dateInterval: '7',
  paging: initialPagingState,
  sort: { field: '', order: '' }
};

const filterState: FilterState = {
  sport: '',
  leagues: [],
  conferences: [],
  divisions: [],
  teams: [],
  competitions: [],
  seasons: [],
  jobType: '',
  jobStatuses: [],
  lineup: '',
  gameOwner: '',
  videoSources: [],
  from: '',
  to: '',
  dateInterval: '7',
  paging: initialPagingState,
  sort: initialFilterState.sort
};

@Injectable()
export class GameTrackerService {
  private _selectedSport: BehaviorSubject<string> = new BehaviorSubject(initialFilterState.sport);
  private _selectedLeagues: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.leagues);
  private _selectedConferences: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.conferences);
  private _selectedDivisions: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.divisions);
  private _selectedTeams: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.teams);
  private _selectedCompetitions: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.competitions);
  private _selectedSeasons: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.seasons);

  private _selectedJobType: BehaviorSubject<string> = new BehaviorSubject(initialFilterState.jobType);
  private _selectedJobStatuses: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.jobStatuses);
  private _selectedLineup: BehaviorSubject<string> = new BehaviorSubject(initialFilterState.lineup);
  private _selectedGameOwner: BehaviorSubject<string> = new BehaviorSubject(initialFilterState.gameOwner);
  private _selectedVideoSources: BehaviorSubject<string[]> = new BehaviorSubject(initialFilterState.videoSources);
  private _selectedFrom: BehaviorSubject<Date> = new BehaviorSubject(initialFilterState.from);
  private _selectedTo: BehaviorSubject<Date> = new BehaviorSubject(initialFilterState.to);
  private _selectedDateInterval: BehaviorSubject<string> = new BehaviorSubject(initialFilterState.dateInterval);

  private _paging: BehaviorSubject<Paging> = new BehaviorSubject(initialFilterState.paging);
  private _sort: BehaviorSubject<any> = new BehaviorSubject({});

  private _leaguesList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);
  private _conferencesList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);
  private _divisionsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);
  private _teamsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);
  private _competitionsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);
  private _seasonsList: BehaviorSubject<SelectItem[]> = new BehaviorSubject([]);

  private _loadedSport: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedLeagues: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedConferences: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedDivisions: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedTeams: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedCompetitions: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loadedSeasons: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _games: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private _callSearch: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private _callIid: BehaviorSubject<number> = new BehaviorSubject(0);

  private readonly callSearch: Observable<any[]> = this._callSearch.asObservable();
  private readonly callIid: Observable<number> = this._callIid.asObservable();

  public readonly selectedSport: Observable<string> = this._selectedSport.asObservable();
  public readonly selectedLeagues: Observable<string[]> = this._selectedLeagues.asObservable();
  public readonly selectedConferences: Observable<string[]> = this._selectedConferences.asObservable();
  public readonly selectedDivisions: Observable<string[]> = this._selectedDivisions.asObservable();
  public readonly selectedTeams: Observable<string[]> = this._selectedTeams.asObservable();
  public readonly selectedCompetitions: Observable<string[]> = this._selectedCompetitions.asObservable();
  public readonly selectedSeasons: Observable<string[]> = this._selectedSeasons.asObservable();

  public readonly selectedJobType: Observable<string> = this._selectedJobType.asObservable();
  public readonly selectedJobStatuses: Observable<string[]> = this._selectedJobStatuses.asObservable();
  public readonly selectedLineup: Observable<string> = this._selectedLineup.asObservable();
  public readonly selectedGameOwner: Observable<string> = this._selectedGameOwner.asObservable();
  public readonly selectedVideoSources: Observable<string[]> = this._selectedVideoSources.asObservable();
  public readonly selectedFrom: Observable<Date> = this._selectedFrom.asObservable();
  public readonly selectedTo: Observable<Date> = this._selectedTo.asObservable();
  public readonly selectedDateInterval: Observable<string> = this._selectedDateInterval.asObservable();

  public readonly paging: Observable<Paging> = this._paging.asObservable();
  public readonly sort: Observable<any> = this._sort.asObservable();

  public readonly leaguesList: Observable<SelectItem[]> = this._leaguesList.asObservable();
  public readonly conferencesList: Observable<SelectItem[]> = this._conferencesList.asObservable();
  public readonly divisionsList: Observable<SelectItem[]> = this._divisionsList.asObservable();
  public readonly teamsList: Observable<SelectItem[]> = this._teamsList.asObservable();
  public readonly competitionsList: Observable<SelectItem[]> = this._competitionsList.asObservable();
  public readonly seasonsList: Observable<SelectItem[]> = this._seasonsList.asObservable();

  public jobTypesList: SelectItem[];
  public jobStatusesList: SelectItem[];
  public playByPlayList: SelectItem[];
  public gameOwnersList: SelectItem[];
  public videoSourceTypesList: SelectItem[];
  public dateSelectionList: SelectItem[];
  public refreshIntervalList: SelectItem[];

  public readonly loadedSport: Observable<boolean> = this._loadedSport.asObservable();
  public readonly loadedLeagues: Observable<boolean> = this._loadedLeagues.asObservable();
  public readonly loadedConferences: Observable<boolean> = this._loadedConferences.asObservable();
  public readonly loadedDivisions: Observable<boolean> = this._loadedDivisions.asObservable();
  public readonly loadedTeams: Observable<boolean> = this._loadedTeams.asObservable();
  public readonly loadedCompetitions: Observable<boolean> = this._loadedCompetitions.asObservable();
  public readonly loadedSeasons: Observable<boolean> = this._loadedSeasons.asObservable();

  public readonly games: Observable<any[]> = this._games.asObservable();
  public readonly loading: Observable<boolean> = this._loading.asObservable();

  constructor(private sportHttpService: HttpSportService) {
    this.jobTypesList = [
      { label: 'Select Job Type', value: '' },
      { label: 'Unknown', value: '0' },
      { label: 'RosterUpdate', value: '1' },
      { label: 'MoveHyperAsset', value: '2' },
      { label: 'CreateMission', value: '3' },
      { label: 'ActivateMission', value: '4' },
      { label: 'Phase1Logging', value: '5' },
      { label: 'Phase2Logging', value: '6' },
      { label: 'Phase3Logging', value: '7' },
      { label: 'ExportEvents', value: '8' },
      { label: 'IngestEvents', value: '9' },
      { label: 'SendToQa', value: '10' },
      { label: 'Encoding', value: '11' }
    ];
    this.jobStatusesList = [
      { label: 'Unknown ', value: '0' },
      { label: 'New', value: '1' },
      { label: 'Ready', value: '8' },
      { label: 'Claimed', value: '2' },
      { label: 'Running', value: '3' },
      { label: 'RetryPending', value: '4' },
      { label: 'Cancelled', value: '5' },
      { label: 'Failed', value: '6' },
      { label: 'Completed', value: '7' }
    ];
    this.playByPlayList = [
      { label: 'Select Lineups Filter', value: '0' },
      { label: 'With Lineups', value: '1' },
      { label: 'Without Lineups', value: '2' }
    ];
    this.gameOwnersList = [
      { label: 'Select Game Owner', value: '0' },
      { label: 'Synergy', value: '1' },
      { label: 'Team Logger', value: '2' }
    ];
    this.videoSourceTypesList = [
      { label: 'None', value: '0' },
      { label: 'DVD', value: '1' },
      { label: 'TV', value: '2' },
    ];
    this.dateSelectionList = [
      { label: 'Select Date Interval', value: '0' },
      { label: 'Yesterday', value: '1' },
      { label: 'Today', value: '2' },
      { label: 'Tomorrow', value: '3' },
      { label: 'Within 24 hours', value: '4' },
      { label: 'Within 48 Hours', value: '5' },
      { label: 'Within 7 Days', value: '6' },
      { label: 'Start Date - End Date', value: '7' }
    ];
    this.refreshIntervalList = [
      { label: 'Refresh every 1 min', value: '1' },
      { label: 'Refresh every 5 min', value: '5' },
      { label: 'Refresh every 10 min', value: '10' },
      { label: 'Refresh every 30 min', value: '30' },
      { label: 'Refresh every 60 min', value: '60' }
    ];

    this.callSearch.subscribe(result => {
      if (filterState.sport) {
        this.sportHttpService.searchGameTrackers(filterState).subscribe(res => {
          this._games.next(res.result);
          this._loading.next(false);
          filterState.paging.total = res.totalRecords;
          this._paging.next(filterState.paging);
        });
      }
    });

    this.callIid.filter(iid => !!iid).subscribe(iid => {
      this.sportHttpService.getGameTrackerByIid(iid).subscribe((res: any) => {
        this._games.next(res.result);
        filterState.paging.total = res.totalRecords;
        this._paging.next(filterState.paging);
      });
    });

    this.selectedSport.subscribe(sport => {
      this.getLeaguesBySport(sport).subscribe(leagues => {
        this.loadLeagues(leagues);
      });
    });

    this.selectedLeagues.subscribe(leagues => {
      this.getConferencesByLeagues(leagues).subscribe(res => {
        this.loadConferences(res);
      });

      this.getDivisionsByLeagues(leagues).subscribe(res => {
        this.loadDivisions(res);
      });

      this.getTeamsByMultipleParams().subscribe(res => {
        this.loadTeams(res);
      });

      this.getCompetitionsByLeagues(leagues).subscribe(res => {
        this.loadCompetitions(res);
      });

      this.getSeasonsByLeagues(leagues).subscribe(res => {
        this.loadSeasons(res);
      });
    });

    this.selectedConferences.subscribe(conferences => {
      this.getTeamsByMultipleParams().subscribe(res => {
        this.loadTeams(res);
      });
    });

    this.selectedDivisions.subscribe(divisions => {
      this.getTeamsByMultipleParams().subscribe(res => {
        this.loadTeams(res);
      });
    });
  }

  loadInitialState(filterUrlOptions) {
    this.loadFilterOptions(filterUrlOptions);
    this._callSearch.next(filterUrlOptions);
  }

  onRefreshGameTrackers(filter) {
    this._callSearch.next(filter);
  }

  onGetByIid(iid: number) {
    this._callIid.next(iid);
  }

  onClearFilters() {
    this._selectedJobType.next(initialFilterState.jobType);
    this._selectedLineup.next(initialFilterState.lineup);
    this._selectedGameOwner.next(initialFilterState.gameOwner);
    this._selectedFrom.next(initialFilterState.from);
    this._selectedTo.next(initialFilterState.to);
    this._selectedDateInterval.next(initialFilterState.dateInterval);

    filterState.leagues = initialFilterState.leagues;
    filterState.conferences = initialFilterState.conferences;
    filterState.divisions = initialFilterState.divisions;
    filterState.teams = initialFilterState.teams;
    filterState.competitions = initialFilterState.competitions;
    filterState.seasons = initialFilterState.seasons;
    filterState.jobType = initialFilterState.jobType;
    filterState.jobStatuses = initialFilterState.jobStatuses;
    filterState.lineup = initialFilterState.lineup;
    filterState.gameOwner = initialFilterState.gameOwner;
    filterState.videoSources = initialFilterState.videoSources;
    filterState.from = '';
    filterState.to = '';
    filterState.dateInterval = initialFilterState.dateInterval;
  }

  loadLeagues(leagues) {
    this._leaguesList.next(leagues);
    this._selectedLeagues.next(filterState.leagues);
    this._loadedLeagues.next(true);
  }

  loadConferences(conferences) {
    if (filterState.leagues.length > 0) {
      this._conferencesList.next(conferences);
      this._selectedConferences.next(filterState.conferences);
      this._loadedConferences.next(true);
    }
  }

  loadDivisions(divisions) {
    if (filterState.leagues.length > 0) {
      this._divisionsList.next(divisions);
      this._selectedDivisions.next(filterState.divisions);
      this._loadedDivisions.next(true);
    }
  }

  loadTeams(teams) {
    if (filterState.leagues.length > 0) {
      this._teamsList.next(teams);
      this._selectedTeams.next(filterState.teams);
      this._loadedTeams.next(true);
    }
  }

  loadCompetitions(competitions) {
    if (filterState.leagues.length > 0) {
      this._competitionsList.next(competitions);
      this._selectedCompetitions.next(filterState.competitions);
      this._loadedCompetitions.next(true);
    }
  }

  loadSeasons(seasons) {
    if (filterState.leagues.length > 0) {
      this._seasonsList.next(seasons);
      this._selectedSeasons.next(filterState.seasons);
      this._loadedSeasons.next(true);
    }
  }

  onSortingChanged(sort: any) {
    filterState.sort = sort;
    this._sort.next(sort);
  }

  onPagingChanged(paging: any) {
    filterState.paging.page = paging.page;
    filterState.paging.size = paging.size;

    this._paging.next(filterState.paging);
  }

  onSportSelected(sport: string) {
    filterState.sport = sport;
    this._selectedSport.next(sport);

    this._selectedLeagues.next([]);
    filterState.leagues = [];
    this.setSportFiltersToInitialState();
  }

  onLeagueSelected(leagues: string[]) {
    filterState.leagues = leagues;
    this._selectedLeagues.next(leagues);

    if (leagues && leagues.length === 0) {
      this.setSportFiltersToInitialState();
    }
  }

  onConferenceSelected(conferences: string[]) {
    filterState.conferences = conferences;
    this._selectedConferences.next(conferences);
  }

  onDivisionSelected(divisions: string[]) {
    filterState.divisions = divisions;
    this._selectedDivisions.next(divisions);
  }

  onTeamSelected(teams: string[]) {
    filterState.teams = teams;
    this._selectedTeams.next(teams);
  }

  onCompetitionSelected(competitions: string[]) {
    filterState.competitions = competitions;
    this._selectedCompetitions.next(competitions);
  }

  onSeasonSelected(seasons: string[]) {
    filterState.seasons = seasons;
    this._selectedSeasons.next(seasons);
  }

  onJobTypeSelected(id: string) {
    filterState.jobType = id;
    this._selectedJobType.next(id);
  }

  onJobStatusSelected(ids: string[]) {
    filterState.jobStatuses = ids;
    this._selectedJobStatuses.next(ids);
  }

  onLineupSelected(id: string) {
    filterState.lineup = id;
    this._selectedLineup.next(id);
  }

  onGameOwnerSelected(id: string) {
    filterState.gameOwner = id;
    this._selectedGameOwner.next(id);
  }

  onVideoSourceSelected(ids: string[]) {
    filterState.videoSources = ids;
    this._selectedVideoSources.next(ids);
  }

  onDateFromSelected(dateFrom: string) {
    filterState.from = dateFrom;
    this._selectedFrom.next(this.convertToDate(dateFrom));
  }

  onDateToSelected(dateTo: string) {
    filterState.to = dateTo;
    this._selectedTo.next(this.convertToDate(dateTo));
  }

  onDateIntervalSelected(dateInterval: string) {
    filterState.dateInterval = dateInterval;
    this._selectedDateInterval.next(dateInterval);
  }

  getSports(): Observable<any[]> {
    return this.sportHttpService.getSports()
      .map(data => this.sortFilterContentByName(data.result))
      .switchMap((entities: any[]) => {
        const baseball = entities.filter(sport => sport.name.toLowerCase() === 'baseball')[0];
        if (baseball) {
          filterState.sport = baseball.id;
          this._selectedSport.next(baseball.id);
          this.getLeaguesBySport(baseball.id).subscribe(res => {
            this._loadedLeagues.next(true);
          });
        }
        this._loadedSport.next(true);

        let sports = [];
        sports = [{ label: 'Select Sport', value: '' }];
        entities.forEach(e => {
          sports.push({ label: e.name, value: e.id });
        });

        return Observable.of(sports);
      });
  }

  getLeaguesBySport(sportId: string = null): Observable<any[]> {
    if (sportId) {
      return this.sportHttpService.getLeagues(sportId)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          this._loadedLeagues.next(true);
          const leagues = [];
          entities.forEach(e => {
            leagues.push({ label: e.name, value: e.id });
          });

          return Observable.of(leagues);
        });
    }
    return Observable.of([]);
  }

  getConferencesByLeagues(leagueIds: string[]): Observable<any[]> {
    if (leagueIds && leagueIds.length > 0) {
      return this.sportHttpService.getConferencesByLeagues(leagueIds)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          const conferences = [];
          entities.forEach(e => {
            conferences.push({ label: e.name, value: e.id });
          });

          return Observable.of(conferences);
        });
    }
    return Observable.of([]);
  }

  getDivisionsByLeagues(leagueIds: string[]): Observable<any[]> {
    if (leagueIds && leagueIds.length > 0) {
      return this.sportHttpService.getDivisionsByLeagues(leagueIds)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          const divisions = [];
          entities.forEach(e => {
            divisions.push({ label: e.name, value: e.id });
          });

          return Observable.of(divisions);
        });
    }
    return Observable.of([]);
  }

  getTeamsByMultipleParams(): Observable<any[]> {
    if (filterState.leagues.length > 0) {
      return this.sportHttpService.getTeamsByMultipleParams(filterState)
        .map(res => this.sortFilterContentByName(res.result))
        .switchMap((entities: any) => {
          const teams = [];
          entities.forEach(e => {
            teams.push({ label: e.name, value: e.id });
          });

          return Observable.of(teams);
        });
    }
    return Observable.of([]);
  }

  getCompetitionsByLeagues(leagueIds: string[] = []): Observable<any[]> {
    if (leagueIds && leagueIds.length > 0) {
      return this.sportHttpService.getCompetitionsByLeagues(leagueIds)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          const competitions = [];
          entities.forEach(e => {
            competitions.push({ label: e.name, value: e.id });
          });

          return Observable.of(competitions);
        });
    }
    return Observable.of([]);
  }

  getSeasonsByLeagues(leagueIds: string[] = []): Observable<any[]> {
    if (leagueIds && leagueIds.length > 0) {
      return this.sportHttpService.getSeasonsByLeagues(leagueIds)
        .map(data => this.sortFilterContentByName(data.result))
        .switchMap((entities: any[]) => {
          const seasons = [];
          entities.forEach(e => {
            seasons.push({ label: e.name, value: e.id });
          });

          return Observable.of(seasons);
        });
    }
    return Observable.of([]);
  }

  private loadFilterOptions(filter) {
    const sportId = filter['sportId'];
    if (sportId) {
      this._selectedSport.next(sportId);
      filterState.sport = sportId;
    }
    let leagueIds = filter['leagueIds'];
    if (leagueIds) {
      leagueIds = leagueIds.split(',');
      filterState.leagues = leagueIds;
    }
    let conferenceIds = filter['conferenceIds'];
    if (conferenceIds) {
      conferenceIds = conferenceIds.split(',');
      filterState.conferences = conferenceIds;
    }
    let divisionIds = filter['divisionIds'];
    if (divisionIds) {
      divisionIds = divisionIds.split(',');
      filterState.divisions = divisionIds;
    }
    let teamIds = filter['teamIds'];
    if (teamIds) {
      teamIds = teamIds.split(',');
      filterState.teams = teamIds;
    }
    let competitionIds = filter['competitionIds'];
    if (competitionIds) {
      competitionIds = competitionIds.split(',');
      filterState.competitions = competitionIds;
    }
    let seasonIds = filter['seasonIds'];
    if (seasonIds) {
      seasonIds = seasonIds.split(',');
      filterState.seasons = seasonIds;
    }
    const jobType = filter['jobTypeId'];
    if (jobType) {
      filterState.jobType = jobType;
      this._selectedJobType.next(jobType);
    }
    let jobStatuses = filter['jobStatusIds'];
    if (jobStatuses) {
      jobStatuses = jobStatuses.split(',');
      filterState.jobStatuses = jobStatuses;
      this._selectedJobStatuses.next(jobStatuses);
    }
    const lineup = filter['lineupId'];
    if (lineup) {
      filterState.lineup = lineup;
      this._selectedLineup.next(lineup);
    }
    const gameOwner = filter['gameOwnerId'];
    if (gameOwner) {
      filterState.gameOwner = gameOwner;
      this._selectedGameOwner.next(gameOwner);
    }
    let videoSources = filter['videoSources'];
    if (videoSources) {
      videoSources = videoSources.split(',');
      filterState.videoSources = videoSources;
      this._selectedVideoSources.next(videoSources);
    }
    const from = filter['gameSelectedFrom'];
    if (from) {
      filterState.from = from;
      this._selectedFrom.next(this.convertToDate(from));
    }
    const to = filter['gameSelectedTo'];
    if (to) {
      filterState.to = to;
      this._selectedTo.next(this.convertToDate(to));
    }
    const dateInterval = filter['gameIntervalId'];
    if (dateInterval) {
      filterState.dateInterval = dateInterval;
      this._selectedDateInterval.next(dateInterval);
    }
    const sortField = filter['sortField'];
    if (sortField) {
      filterState.sort.field = sortField;
      this._sort.next(filterState.sort);
    }
    const sortOrder = filter['sortOrder'];
    if (sortOrder) {
      filterState.sort.order = sortOrder;
      this._sort.next(filterState.sort);
    }
  }

  private setSportFiltersToInitialState() {
    this._loadedConferences.next(false);
    this._loadedDivisions.next(false);
    this._loadedTeams.next(false);
    this._loadedCompetitions.next(false);
    this._loadedSeasons.next(false);

    this._selectedConferences.next([]);
    this._selectedDivisions.next([]);
    this._selectedTeams.next([]);
    this._selectedCompetitions.next([]);
    this._selectedSeasons.next([]);

    filterState.conferences = [];
    filterState.divisions = [];
    filterState.teams = initialFilterState.teams;
    filterState.competitions = initialFilterState.competitions;
    filterState.seasons = initialFilterState.seasons;
  }

  private convertToDate(str: string) {
    return moment(str).toDate();
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
}
