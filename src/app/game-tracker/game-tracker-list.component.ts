﻿import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem } from 'primeng/primeng';
import { GameTrackerService } from './game-tracker.service';
import { DateTimeUtils } from '../shared/utils/datetime-utils';
import { NotificationService } from '../shared/services/notification.service';
import { Game } from '../sport/games/game.entity';
import { OperationsHttpService } from '../shared/services/operations.service';
import * as moment from 'moment';
import { JobType } from '../sport/games/job.entity';
import { FilterComponent } from './filter.component';

@Component({
  selector: 'sn-game-tracker-list',
  templateUrl: 'game-tracker-list.component.html'
})
export class GameTrackerListComponent implements OnInit, OnDestroy {
  @Input() gameFilterOptions;
  @Output() create = new EventEmitter(false);
  @Output() loading = new EventEmitter(false);
  collapsed: boolean;
  public title: string;
  error$;
  loadingSub: Subscription;
  gamesSub: Subscription;
  sportSub: Subscription;
  loadServersSub: Subscription;

  sport$: Observable<string>;
  sports$;
  sportLoaded$;

  league$;
  leagues$;
  leagueLoaded$;

  division$;
  divisions$;
  divisionLoaded$;

  conference$;
  conferences$;
  conferenceLoaded$;

  season$;
  seasons$;
  seasonLoaded$;

  team$;
  teams$;
  teamLoaded$;

  competition$;
  competitions$;
  competitionLoaded$;

  jobTypes;
  jobStatuses;
  playsByPlay;
  dateSelections;
  gameOwners;
  videoSourceTypes;

  jobTypesModel$;
  jobStatusesModel$;
  pbpModel$;
  dateSelectionModel$;
  gameOwner$;
  videoSource$;

  fromDate$;
  toDate$;

  loading$;

  refreshIntervals: any[];

  gameIid = '';
  games;

  servers;
  serversFullInfo;

  sort$;
  gamePaging$;
  page$;
  size$;
  total$;
  rowsPerPageOptions$;

  leagueLabel = 'Select Leagues';
  divisionLabel = 'Select Hierarchy 2';
  conferenceLabel = 'Select Hierarchy 1';
  teamLabel = 'Select Teams';
  competitionsLabel = 'Select Competitions';
  seasonLabel = 'Select Seasons';
  jobStatusLabel = 'Select Job Statuses';
  videoSourceLabel = 'Select Video Source';
  dateRangeEnabled = '7';
  cols: any[];
  columnOptions: SelectItem[];
  visibleColumns: { [key: string]: boolean };

  @ViewChild('filter') filter: FilterComponent;

  constructor(public router: Router,
              public route: ActivatedRoute,
              private notificationService: NotificationService,
              private operationsService: OperationsHttpService,
              private gameTrackerService: GameTrackerService
  ) {
    this.cols = [
      { field: 'Id', header: 'ID' },
      { field: 'viewDate', header: 'Date' },
      { field: 'name', header: 'Name' },
      { field: 'homeTeam.name', header: 'Home' },
      { field: 'awayTeam.name', header: 'Away' },
      { field: 'league.name', header: 'League' },
      { field: 'competition.name', header: 'Competition' },
      { field: 'overallJobsStatus', header: 'Next Step' },
      { field: 'server', header: 'Server' },
      { field: 'dueDateValue', header: 'Due Date' },
      { field: 'priority', header: 'Priority' },
      { field: 'videoSource', header: 'Video Source' },
      { field: 'desiVersion', header: 'Desi Version' },
      { field: 'missionId', header: 'Mission ID' },
      { field: 'missionStatus', header: 'Mission Status' },
      { field: 'p1Logger', header: 'P1 Logger' },
      { field: 'p2Logger', header: 'P2 Logger' },
      { field: 'p3Logger', header: 'P3 Logger' }
    ];
    this.visibleColumns = {
      'Id': false,
      'viewDate': true,
      'name': false,
      'homeTeam.name': true,
      'awayTeam.name': true,
      'league.name': true,
      'competition.name': false,
      'overallJobsStatus': false,
      'server': false,
      'dueDateValue': false,
      'priority': false,
      'videoSource': false,
      'desiVersion': true,
      'missionId': true,
      'missionStatus': true,
      'p1Logger': true,
      'p2Logger': true,
      'p3Logger': true
    };
    this.columnOptions = [];
    for (const col of this.cols) {
      this.columnOptions.push({ label: col.header, value: col });
    }
    this.cols = this.cols.filter(e => e.field !== 'Id'
                                   && e.field !== 'name'
                                   && e.field !== 'competition.name'
                                   && e.field !== 'overallJobsStatus'
                                   && e.field !== 'server'
                                   && e.field !== 'dueDateValue'
                                   && e.field !== 'priority'
                                   && e.field !== 'videoSource');
  }

  ngOnInit() {
    if ( this.gameFilterOptions.sportId === undefined) {
      this.gameFilterOptions.sportId = '570aaedc46c5d11de0f8c0bd';
    }
    this.gameTrackerService.loadInitialState(this.gameFilterOptions);
    this.collapsed = false;
    this.title = 'Game List';
    this.loadServers();

    this.loading$ = this.gameTrackerService.loading;
    this.loadingSub = this.loading$.subscribe(res => {
      this.loading.emit(res);
    });

    this.gamesSub = this.gameTrackerService.games.map(this.mapGames).subscribe(res => {
      this.games = res;
    });

    this.sport$ = this.gameTrackerService.selectedSport;
    this.sports$ = this.gameTrackerService.getSports();
    this.sportLoaded$ = this.gameTrackerService.loadedSport;

    this.sportSub = this.gameTrackerService.selectedSport.subscribe(sportId => {
      this.filter.setValue('sportId', sportId);
    });

    this.league$ = this.gameTrackerService.selectedLeagues;
    this.leagues$ = this.gameTrackerService.leaguesList;
    this.leagueLoaded$ = this.gameTrackerService.loadedLeagues;

    this.division$ = this.gameTrackerService.selectedDivisions;
    this.divisions$ = this.gameTrackerService.divisionsList;
    this.divisionLoaded$ = this.gameTrackerService.loadedDivisions;

    this.conference$ = this.gameTrackerService.selectedConferences;
    this.conferences$ = this.gameTrackerService.conferencesList;
    this.conferenceLoaded$ = this.gameTrackerService.loadedConferences;

    this.season$ = this.gameTrackerService.selectedSeasons;
    this.seasons$ = this.gameTrackerService.seasonsList;
    this.seasonLoaded$ = this.gameTrackerService.loadedSeasons;

    this.team$ = this.gameTrackerService.selectedTeams;
    this.teams$ = this.gameTrackerService.teamsList;
    this.teamLoaded$ = this.gameTrackerService.loadedTeams;

    this.competition$ = this.gameTrackerService.selectedCompetitions;
    this.competitions$ = this.gameTrackerService.competitionsList;
    this.competitionLoaded$ = this.gameTrackerService.loadedCompetitions;

    this.jobTypes = this.gameTrackerService.jobTypesList;
    this.jobTypesModel$ = this.gameTrackerService.selectedJobType;

    this.jobStatuses = this.gameTrackerService.jobStatusesList;
    this.jobStatusesModel$ = this.gameTrackerService.selectedJobStatuses;

    this.playsByPlay = this.gameTrackerService.playByPlayList;
    this.pbpModel$ = this.gameTrackerService.selectedLineup;

    this.gameOwners = this.gameTrackerService.gameOwnersList;
    this.gameOwner$ = this.gameTrackerService.selectedGameOwner;

    this.videoSourceTypes = this.gameTrackerService.videoSourceTypesList;
    this.videoSource$ = this.gameTrackerService.selectedVideoSources;

    this.fromDate$ = this.gameTrackerService.selectedFrom;
    this.toDate$ = this.gameTrackerService.selectedTo;
    this.dateSelections = this.gameTrackerService.dateSelectionList;
    this.dateSelectionModel$ = this.gameTrackerService.selectedDateInterval;

    this.refreshIntervals = this.gameTrackerService.refreshIntervalList;

    this.gamePaging$ = this.gameTrackerService.paging;
    this.sort$ = this.gameTrackerService.sort
      .map(res => ({ field: res.field, order: res.order === 'asc' ? '1' : '-1' }));
    this.page$ = this.gamePaging$.map(p => p.page);
    this.size$ = this.gamePaging$.map(p => p.size);
    this.total$ = this.gamePaging$.map(p => p.total);
    this.rowsPerPageOptions$ = this.gamePaging$.map(p => p.rowsPerPageOptions);
  }
  onSelectItem(v) {}
  ngOnDestroy() {
    this.loadingSub.unsubscribe();
    this.gamesSub.unsubscribe();
    this.sportSub.unsubscribe();
    this.loadServersSub.unsubscribe();
  }

  loadGameTrackers(e: any) {
    const paging = { page: (e.first / e.rows) + 1, size: e.rows };
    const sort: { field: string, order: 'asc' | 'desc' } = {
      field: this.mapSortFieldName(e.sortField),
      order: e.sortOrder === 1 ? 'asc' : 'desc'
    };

    this.gameTrackerService.onSortingChanged(sort);
    this.filter.setValue('sortField', sort.field);
    this.filter.setValue('sortOrder', sort.order);
    this.gameTrackerService.onPagingChanged(paging);
    this.gameTrackerService.onRefreshGameTrackers(this.filter);
  }

  onSearchIidKeyPressed(event) {
    if (event.keyCode === 13) {
      this.searchGameByIid();
    }
  }

  searchGameByIid() {
    const iid = Number(this.gameIid);
    if (iid) {
      this.gameTrackerService.onGetByIid(iid);
    } else {
      if (iid === 0) {
        this.gameTrackerService.onRefreshGameTrackers(this.filter);
        return;
      }
      this.notificationService.showError('Iid incorrect', 'Please enter iid in numeric format', 3);
    }
  }

  clearAllFilters() {
    this.gameTrackerService.onLeagueSelected([]);
    this.gameTrackerService.onJobStatusSelected([]);
    this.gameTrackerService.onVideoSourceSelected([]);
    this.gameTrackerService.onClearFilters();
  }

  onRefreshClicked() {
    this.gameTrackerService.onRefreshGameTrackers(this.filter);
  }

  onAdd() {
    this.create.emit(true);
    return false;
  }

  onServerSelected(game, serverId) {
    const server = this.serversFullInfo.filter(s => s.id === serverId)[0];
    if (server) {
      game.encodingServer = {
        id: server.id,
        iid: server.iid,
        name: server.name
      };
      game.edited = true;
    }
  }

  onColumnListChange(selected) {
    for (const c in this.visibleColumns) {
      if (selected.filter(e => e.field === c)[0]) {
        this.visibleColumns[c] = true;
      } else {
        this.visibleColumns[c] = false;
      }
    }
  }

  selectionSportChanged(id) {
    this.filter.setValue('sportId', id);
    this.gameTrackerService.onSportSelected(id);
  }

  selectionLeagueChanged(ids) {
    this.filter.addValues('leagueIds', ids);
    this.gameTrackerService.onLeagueSelected(ids);
  }

  selectionDivisionChanged(ids) {
    this.filter.addValues('divisionIds', ids);
    this.gameTrackerService.onDivisionSelected(ids);
  }

  selectionConferenceChanged(ids) {
    this.filter.addValues('conferenceIds', ids);
    this.gameTrackerService.onConferenceSelected(ids);
  }

  selectionTeamChanged(ids) {
    this.filter.addValues('teamIds', ids);
    this.gameTrackerService.onTeamSelected(ids);
  }

  selectionCompetitionChanged(ids) {
    this.filter.addValues('competitionIds', ids);
    this.gameTrackerService.onCompetitionSelected(ids);
  }

  selectionSeasonChanged(ids) {
    this.filter.addValues('seasonIds', ids);
    this.gameTrackerService.onSeasonSelected(ids);
  }

  selectionJobTypeChanged(id) {
    this.filter.setValue('jobTypeId', id);
    this.gameTrackerService.onJobTypeSelected(id);
  }

  selectionJobStatusChanged(ids) {
    this.filter.addValues('jobStatusIds', ids);
    this.gameTrackerService.onJobStatusSelected(ids);
  }

  selectionLineupChanged(id) {
    this.filter.setValue('lineupId', id);
    this.gameTrackerService.onLineupSelected(id);
  }

  selectionGamesOwnerChanged(id) {
    this.filter.setValue('gameOwnerId', id);
    this.gameTrackerService.onGameOwnerSelected(id);
  }

  selectionVideoSourceChanged(ids) {
    this.filter.addValues('videoSources', ids);
    this.gameTrackerService.onVideoSourceSelected(ids);
  }

  selectionDateIntervalChanged(id) {
    this.filter.setValue('gameIntervalId', id);
    this.gameTrackerService.onDateIntervalSelected(id);
  }

  selectionChanged(source, date) {
    if (source === 'from') {
      this.filter.setValue('gameSelectedFrom', DateTimeUtils.stringifyDate(date));
      this.gameTrackerService.onDateFromSelected(DateTimeUtils.stringifyDate(date));
    } else if (source === 'to') {
      this.filter.setValue('gameSelectedTo', DateTimeUtils.stringifyDate(date));
      this.gameTrackerService.onDateToSelected(DateTimeUtils.stringifyDate(date));
    }
  }

  onKeyDownCalendar(source, event) {
    if (event.keyCode === 13) {
      const strDate = event.target.value;
      try {
        const date = new Date(strDate);
        if (source === 'from') {
          this.filter.setValue('gameSelectedFrom', DateTimeUtils.stringifyDate(date));
          this.gameTrackerService.onDateFromSelected(DateTimeUtils.stringifyDate(date));
        } else if (source === 'to') {
          this.filter.setValue('gameSelectedTo', DateTimeUtils.stringifyDate(date));
          this.gameTrackerService.onDateToSelected(DateTimeUtils.stringifyDate(date));
        }
      } catch (ex) {
        this.notificationService.showError(
          `Format of date calendar '${source}' is incorrect. Must be in format mm/dd/yyyy!`);
      }
    }
  }

  paginate(p) {
    this.gameTrackerService.onPagingChanged({ page: p.page + 1, size: +p.rows });
    this.filter.setValue('paging', p);
    this.gameTrackerService.onRefreshGameTrackers(this.filter);
  }

  serverFilterChanged(dt, event, field, filterMatchMode) {
    if (this.isMouseClickEvent(event)) {
      dt.filter(event.value, field, filterMatchMode);
    }
  }

  mapGames(games: any[]) {
    games.forEach(g => {
      if (g.utc) {
        const converted = DateTimeUtils.CreateDateFromUtcAndTimezone(g.utc, g.timeZone);
        g.viewDate = `${moment(converted.date).format('MM/DD/YYYY')}`;
        g.viewTime = `${moment(converted.date).format('HH:mm')} ${converted.timeZoneAbbr}`;
        // g.viewDate = moment(g.utc).format('MM/DD/YYYY HH:mm');
      } else {
        g.viewDate = DateTimeUtils.ApiDateToString(g.date);
        g.viewTime = '';
      }
      g.overallJobsStatus = Game.getGameJobsOverallStatus(g.jobs);
      if (g.dueDate) {
        g.dueDateValue = moment(g.dueDate).toDate();
      }
      if (g.encodingServer) {
        g.server = g.encodingServer.name;
      }
      if (g.jobs) {
        const jobPhase1 = g.jobs.filter(j => j.jobTypes === JobType.Phase1Logging)[0];
        if (jobPhase1) {
          g.p1Logger = jobPhase1.assignee ? jobPhase1.assignee.name : '';
        }
        const jobPhase2 = g.jobs.filter(j => j.jobTypes === JobType.Phase2Logging)[0];
        if (jobPhase2) {
          g.p2Logger = jobPhase2.assignee ? jobPhase2.assignee.name : '';
        }
        const jobPhase3 = g.jobs.filter(j => j.jobTypes === JobType.Phase3Logging)[0];
        if (jobPhase3) {
          g.p3Logger = jobPhase3.assignee ? jobPhase3.assignee.name : '';
        }
      }
    });
    return games;
  }

  p1LoggerName(game) {
    const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase1Logging)[0];
    return this.loggerName(job);
  }

  p2LoggerName(game) {
    const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase2Logging)[0];
    return this.loggerName(job);

  }

  p3LoggerName(game) {
    const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase3Logging)[0];
    return this.loggerName(job);
  }

  loggerName(job) {
    if (!!job && !!job.assignee) {
      const assignee = job.assignee;
      return `${assignee.first || ''} ${assignee.last || ''}`;
    }

    return '';
  }

  editInitiated(row) {
    row.column.overflow = 'visible';
  }

  editCompleted(row) {
    row.data.edited = true;
    console.log(row.column);
    console.log(row.data);
    row.column.overflow = 'hidden';
  }

  editCanceled(row) {
    console.log(row.column);
    console.log(row.data);
    row.column.overflow = 'hidden';
    // row.data[row.column.field] = null;
  }

  onSaveRowChanges(game) {
    game.saving = true;
    let dueDate = '';
    if (game.dueDateValue) {
      dueDate = moment(game.dueDateValue).format(DateTimeUtils.ServerDateTimeFormat);
    }
    const priority = game.priority;

    // todo: refactor, hacky to get latest version of gameTracker entity
    this.operationsService.getGameTracker(game.id)
      .subscribe(res => {
        res.dueDate = dueDate;
        res.priority = priority;
        res.videoSource = game.videoSource;
        res.desiVersion = game.desiVersion;
        res.encodingServer = game.encodingServer;
        this.operationsService.putGameTracker(game.id, res)
          .subscribe(_ => {
            game.edited = false;
            game.saving = false;
            this.notificationService.showSuccess('Success');
          }, err => {
            game.saving = false;
            this.notificationService.showError('Save failed.', err, 3);
          });
      }, err => {
        game.saving = false;
      });
  }

  dueDateSelected(game, date) {
    game.dueDateValue = date;
    game.edited = true;
    this.onSaveRowChanges(game);
  }

  prioritySelected(game, priority) {
    game.priority = priority > 0 ? priority : undefined;
    game.edited = true;
  }

  videoSourceSelected(game, videoSource) {
    game.videoSource = videoSource;
    game.edited = true;
  }

  desiVersionSelected(game, desiVersion) {
    game.desiVersion = desiVersion;
    game.edited = true;
  }

  onNavigate(params: any[]) {
    this.router.navigate(params);
  }

  navigateToDetails(id) {
    this.router.navigate(['/sport/games', id]);
  }

  private mapSortFieldName(fieldName: string): string {
    if (fieldName === 'viewDate') {
      return 'date';
    }
    if (fieldName === 'dueDateValue') {
      return 'dueDate';
    }
    return fieldName;
  }

  private isMouseClickEvent(event) {
    return event.originalEvent.type === 'click';
  }

  private loadServers() {
    this.loadServersSub = this.operationsService.getServers()
      .map((res: any) => res.result)
      .mergeMap((entities: any[]) => {
        const servers = [{ label: 'Select Server', value: '' }];
        for (const entity of entities) {
          servers.push({ label: entity.name, value: entity.id });
        }
        return Observable.of(servers);
      }, (serverResult, nextResult) => ({ fullResult: serverResult, nextRes: nextResult }))
      .subscribe((res: any) => {
        this.servers = res.nextRes;
        this.serversFullInfo = res.fullResult;
      }, error => {
        this.notificationService.showError('Error while loading servers', error);
      });
  }
}
