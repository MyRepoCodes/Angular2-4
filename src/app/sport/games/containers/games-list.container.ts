// ﻿import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { mergeEffects } from '@ngrx/effects';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppState } from '../../../app.state';
// import { Subscription } from 'rxjs/Subscription';
// import { GameFilterEffects } from '../game-filter.effects';
// import { SelectItem } from 'primeng/primeng';
// import {
//   getGameFilterFromDate,
//   getGameFilterToDate, getGameFilterState, getGameFilterPagingState,
//   getGameFilterSport, getGameFilterSports, getGameFilterLeague, getGameFilterLeagues,
//   getGameFilterDivision, getGameFilterDivisions, getGameFilterConference, getGameFilterConferences, getGameFilterSeason,
//   getGameFilterSeasons, getGameFilterTeam, getGameFilterTeams, getGameFilterCompetition, getGameFilterCompetitions,
//   getCollection, getCollectionLoading, getGameFilterSportState, getGameFilterLeagueState, getGameFilterDivisionState,
//   getGameFilterConferenceState, getGameFilterSeasonState, getGameFilterTeamState, getGameFilterCompetitionState,
//   getGameFilterJobType, getGameFilterJobStatus, getGameFilterLineup, getGameFilterDateInterval,
//   getGameFilterGameOwner, getGameFilterDateIntervalState, getGameFilterSortState, getGameFilterVideoSources
// } from '../../../shared/reducers';
// import { Observable } from 'rxjs/Observable';
// import { GamesActions } from '../game.actions';
// import { Paging } from '../../../shared/reducers';
// import { DateTimeUtils } from '../../../shared/utils/datetime-utils';
// import { FilterComponent } from '../../../shared/components/filter/filter.component';
// import { NotificationService } from '../../../shared/services/notification.service';
// import { Game } from '../game.entity';
// import { OperationsHttpService } from '../../../shared/services/operations.service';
// import * as moment from 'moment';
// import { JobType } from '../job.entity';
//
// @Component({
//   selector: 'sn-games-list-container',
//   templateUrl: 'games-list.container.html',
//   /*styles: [`
//     .ui-datatable-scrollable-header { overflow: visible; }
//     .ui-datatable-resizable { overflow: hidden; }
//     .ui-column-title { display: block }
//   `],*/
//   // encapsulation: ViewEncapsulation.None,
//   providers: [GameFilterEffects]
// })
// export class GamesListContainer implements OnInit, OnDestroy {
//   @Input() gameFilterOptions;
//   @Output() create = new EventEmitter(false);
//   @Output() loading = new EventEmitter(false);
//
//   public title: string;
//   emptySport;
//   sport$: Observable<string>;
//   sports$;
//   sportLoading$;
//   sportLoaded$;
//
//   emptyLeague;
//   league$;
//   leagues$;
//   leagueLoading$;
//   leagueLoaded$;
//
//   emptyDivision;
//   division$;
//   divisions$;
//   divisionLoading$;
//   divisionLoaded$;
//
//   emptyConference;
//   conference$;
//   conferences$;
//   conferenceLoading$;
//   conferenceLoaded$;
//
//   emptySeason;
//   season$;
//   seasons$;
//   seasonLoading$;
//   seasonLoaded$;
//
//   emptyTeam;
//   team;
//   team$;
//   teams$;
//   teamLoading$;
//   teamLoaded$;
//
//   emptyCompetition;
//   competition$;
//   competitions$;
//   competitionLoading$;
//   competitionLoaded$;
//
//   /*homeTeam$;
//   awayTeam$;
//
//   p1Logger$;
//   p1Loggers$;
//   p1LoggerLoading$;
//   p1LoggerLoaded$;
//
//   p2Logger$;
//   p2Loggers$;
//   p2LoggerLoading$;
//   p2LoggerLoaded$;
//
//   p3Logger$;
//   p3Loggers$;
//   p3LoggerLoading$;
//   p3LoggerLoaded$;
//
//   server$;
//   servers$;
//   serverLoading$;
//   serverLoaded$;
//
//   missionStatuses;
//   missionStatus = [];*/
//
//   fromDate$;
//   toDate$;
//
//   limit$;
//   limits$;
//
//   games$;
//   games = [];
//   loading$;
//   filter$;
//
//   gameInfo;
//   jobTypes;
//   jobStatuses;
//   playByPlay;
//   dateSelection;
//   gameOwners;
//   videoSourceTypes;
//
//   jobTypesModel$;
//   jobStatusesModel$;
//   pbpModel$;
//   dateSelectionModel$;
//   gameOwner$;
//   videoSource$;
//   dataRangeEnabled$;
//
//   subscription: Subscription;
//   sub: Subscription;
//
//   refreshInterval: any[];
//   limits: any[];
//
//   gameIid = '';
//
//   servers;
//   serversFullInfo;
//   /*date$;
//   dueDate$;*/
//
//   sort$;
//
//   gamePaging$;
//   first$;
//   page$;
//   size$;
//   total$;
//   rowsPerPageOptions$;
//
//   leagueLabel = 'Select Leagues';
//   divisionLabel = 'Select Hierarchy 2';
//   conferenceLabel = 'Select Hierarchy 1';
//   teamLabel = 'Select Teams';
//   competitionsLabel = 'Select Competitions';
//   seasonLabel = 'Select Seasons';
//   jobStatusLabel = 'Select Job Statuses';
//   videoSourceLabel = 'Select Video Source';
//   cols: any[];
//   columnOptions: SelectItem[];
//   visibleColumns: { [key: string]: boolean };
//   @ViewChild('filter') filter: FilterComponent;
//
//   constructor(
//     private gameFilterEffects: GameFilterEffects,
//     private store: Store<AppState>,
//     public router: Router,
//     public route: ActivatedRoute,
//     private notificationService: NotificationService,
//     private operationsService: OperationsHttpService
//   ) {
//     this.subscription = mergeEffects(gameFilterEffects).subscribe(store);
//
//     this.refreshInterval = [];
//     this.refreshInterval.push({ label: 'Refresh every 1 min', value: '1' });
//     this.refreshInterval.push({ label: 'Refresh every 5 min', value: '5' });
//     this.refreshInterval.push({ label: 'Refresh every 10 min', value: '10' });
//     this.refreshInterval.push({ label: 'Refresh every 30 min', value: '30' });
//     this.refreshInterval.push({ label: 'Refresh every 60 min', value: '60' });
//
//     // stub data
//     this.gameInfo = [{ label: 'Game Info', value: '1' }];
//     this.jobTypes = [
//       { label: 'Select Job Type', value: '' },
//       { label: 'Unknown', value: '0' },
//       { label: 'RosterUpdate', value: '1' },
//       { label: 'MoveHyperAsset', value: '2' },
//       { label: 'CreateMission', value: '3' },
//       { label: 'ActivateMission', value: '4' },
//       { label: 'Phase1Logging', value: '5' },
//       { label: 'Phase2Logging', value: '6' },
//       { label: 'Phase3Logging', value: '7' },
//       { label: 'ExportEvents', value: '8' },
//       { label: 'IngestEvents', value: '9' },
//       { label: 'SendToQa', value: '10' },
//       { label: 'Encoding', value: '11' }
//     ];
//     this.jobStatuses = [
//       { label: 'Unknown ', value: '0' },
//       { label: 'New', value: '1' },
//       { label: 'Ready', value: '8' },
//       { label: 'Claimed', value: '2' },
//       { label: 'Running', value: '3' },
//       { label: 'RetryPending', value: '4' },
//       { label: 'Cancelled', value: '5' },
//       { label: 'Failed', value: '6' },
//       { label: 'Completed', value: '7' }
//     ];
//     /*this.missionStatuses = [
//       { label: 'Unknown ', value: 'Unknown' },
//       { label: 'New', value: 'New' },
//       { label: 'Ready', value: 'Ready' },
//       { label: 'Setup', value: 'Setup' },
//       { label: 'Cancelled', value: 'Cancelled' },
//       { label: 'Failed', value: 'Failed' },
//       { label: 'Completed', value: 'Completed' }
//     ];*/
//     this.playByPlay = [
//       { label: 'Select Lineups Filter', value: '0' },
//       { label: 'With Lineups', value: '1' },
//       { label: 'Without Lineups', value: '2' }
//     ];
//     this.dateSelection = [
//       { label: 'Select Date Interval', value: '0' },
//       { label: 'Yesterday', value: '1' },
//       { label: 'Today', value: '2' },
//       { label: 'Tomorrow', value: '3' },
//       { label: 'Within 24 hours', value: '4' },
//       { label: 'Within 48 Hours', value: '5' },
//       { label: 'Within 7 Days', value: '6' },
//       { label: 'Start Date - End Date', value: '7' }
//     ];
//     this.gameOwners = [
//       { label: 'Select Game Owner', value: '0' },
//       { label: 'Synergy', value: '1' },
//       { label: 'Team Logger', value: '2' }
//     ];
//
//     this.videoSourceTypes = [
//       { label: 'None', value: '0' },
//       { label: 'DVD', value: '1' },
//       { label: 'TV', value: '2' },
//     ];
//     this.cols = [
//       { field: 'Id', header: 'ID' },
//       { field: 'viewDate', header: 'Date' },
//       { field: 'name', header: 'Name' },
//       { field: 'homeTeam.name', header: 'Home' },
//       { field: 'awayTeam.name', header: 'Away' },
//       { field: 'league.name', header: 'League' },
//       { field: 'competition.name', header: 'Competition' },
//       { field: 'overallJobsStatus', header: 'Next Step' },
//       { field: 'server', header: 'Server' },
//       { field: 'dueDateValue', header: 'Due Date' },
//       { field: 'priority', header: 'Priority' },
//       { field: 'videoSource', header: 'Video Source' },
//       { field: 'desiVersion', header: 'Desi Version' },
//       { field: 'missionId', header: 'Mission ID' },
//       { field: 'missionStatus', header: 'Mission Status' },
//       { field: 'p1Logger', header: 'P1 Logger' },
//       { field: 'p2Logger', header: 'P2 Logger' },
//       { field: 'p3Logger', header: 'P3 Logger' }
//     ];
//     this.visibleColumns = {
//       'Id': false,
//       'viewDate': true,
//       'name': false,
//       'homeTeam.name': true,
//       'awayTeam.name': true,
//       'league.name': true,
//       'competition.name': false,
//       'overallJobsStatus': false,
//       'server': false,
//       'dueDateValue': false,
//       'priority': false,
//       'videoSource': false,
//       'desiVersion': true,
//       'missionId': true,
//       'missionStatus': true,
//       'p1Logger': true,
//       'p2Logger': true,
//       'p3Logger': true
//     };
//     this.columnOptions = [];
//     for (let col of this.cols) {
//       this.columnOptions.push({ label: col.header, value: col });
//     }
//     this.cols = this.cols.filter(e => e.field !== 'Id'
//       && e.field !== 'name'
//       && e.field !== 'competition.name'
//       && e.field !== 'overallJobsStatus'
//       && e.field !== 'server'
//       && e.field !== 'dueDateValue'
//       && e.field !== 'priority'
//       && e.field !== 'videoSource'
//     );
//   }
//   onColumnListChange(selected) {
//     for (let c in this.visibleColumns) {
//       if (selected.filter(e => e.field === c)[0]) {
//         this.visibleColumns[c] = true;
//       } else {
//         this.visibleColumns[c] = false;
//       }
//     }
//   }
//
//   ngOnInit() {
//     this.title = 'Game List';
//     this.loadServers();
//
//     this.store.dispatch(GamesActions.filterCreated(this.gameFilterOptions));
//     this.sub = this.route.params.subscribe(result => {
//       this.fillFiltersFromUrl(result);
//     });
//     this.store.dispatch(GamesActions.search());
//
//     this.store.let(getCollection('game')).map(this.mapGames).subscribe(res => {
//       this.games = res;
//       // for (let i = 0; i < res.length; i++) {
//       //   this.games[i] = Object.assign({}, { 'edited': false }, res[i]);
//       // }
//
//     });
//     this.loading$ = this.store.let(getCollectionLoading('game'));
//     this.loading$.subscribe(res => {
//       this.loading.emit(res);
//     });
//
//     this.filter$ = this.store.let(getGameFilterState());
//
//     this.sport$ = this.store.let(getGameFilterSport()).map(this.mapToId);
//     this.sports$ = this.store.let(getGameFilterSports()).map(this.mapToSelectedItems('Sport'));
//     this.sportLoading$ = this.store.let(getGameFilterSportState()).map(data => data.loading);
//     this.sportLoaded$ = this.store.let(getGameFilterSportState()).map(data => data.loaded);
//
//     this.league$ = this.store.let(getGameFilterLeague()).map(this.mapToIds);
//     this.leagues$ = this.store.let(getGameFilterLeagues()).map(this.mapToSelectedItems('League'));
//     this.leagueLoading$ = this.store.let(getGameFilterLeagueState()).map(data => data.loading);
//     this.leagueLoaded$ = this.store.let(getGameFilterLeagueState()).map(data => data.loaded);
//
//     this.division$ = this.store.let(getGameFilterDivision()).map(this.mapToIds);
//     this.divisions$ = this.store.let(getGameFilterDivisions()).map(this.mapToSelectedItems('Division'));
//     this.divisionLoading$ = this.store.let(getGameFilterDivisionState()).map(data => data.loading);
//     this.divisionLoaded$ = this.store.let(getGameFilterDivisionState()).map(data => data.loaded);
//
//     this.conference$ = this.store.let(getGameFilterConference()).map(this.mapToIds);
//     this.conferences$ = this.store.let(getGameFilterConferences()).map(this.mapToSelectedItems('Conference'));
//     this.conferenceLoading$ = this.store.let(getGameFilterConferenceState()).map(data => data.loading);
//     this.conferenceLoaded$ = this.store.let(getGameFilterConferenceState()).map(data => data.loaded);
//
//     this.season$ = this.store.let(getGameFilterSeason()).map(this.mapToIds);
//     this.seasons$ = this.store.let(getGameFilterSeasons()).map(this.mapToSelectedItems('Season'));
//     this.seasonLoading$ = this.store.let(getGameFilterSeasonState()).map(data => data.loading);
//     this.seasonLoaded$ = this.store.let(getGameFilterSeasonState()).map(data => data.loaded);
//
//     this.team$ = this.store.let(getGameFilterTeam()).map(this.mapToIds);
//     this.teams$ = this.store.let(getGameFilterTeams()).map(this.mapToSelectedItems('Team'));
//     this.teamLoading$ = this.store.let(getGameFilterTeamState()).map(data => data.loading);
//     this.teamLoaded$ = this.store.let(getGameFilterTeamState()).map(data => data.loaded);
//
//     /*this.homeTeam$ = this.store.let(getGameFilterHomeTeam()).map(this.mapToIds);
//     this.awayTeam$ = this.store.let(getGameFilterAwayTeam()).map(this.mapToIds);*/
//
//     /*this.server$ = this.store.let(getGameFilterServer()).map(this.mapToIds);
//     this.servers$ = this.store.let(getGameFilterServers()).map(this.mapToSelectedItems('Server'));
//     this.serverLoading$ = this.store.let(getGameFilterServerState()).map(data => data.loading);
//     this.serverLoaded$ = this.store.let(getGameFilterServerState()).map(data => data.loaded);*/
//
//     this.competition$ = this.store.let(getGameFilterCompetition()).map(this.mapToIds);
//     this.competitions$ = this.store.let(getGameFilterCompetitions()).map(this.mapToSelectedItems('Competition'));
//     this.competitionLoading$ = this.store.let(getGameFilterCompetitionState()).map(data => data.loading);
//     this.competitionLoaded$ = this.store.let(getGameFilterCompetitionState()).map(data => data.loaded);
//
//     /*this.p1Logger$ = this.store.let(getGameFilterP1Logger()).map(this.mapToIds);
//     this.p1Loggers$ = this.store.let(getGameFilterP1Loggers()).map(this.mapToSelectedItems('Logger'));
//     this.p1LoggerLoading$ = this.store.let(getGameFilterP1LoggerState()).map(data => data.loading);
//     this.p1LoggerLoaded$ = this.store.let(getGameFilterP1LoggerState()).map(data => data.loaded);
//
//     this.p2Logger$ = this.store.let(getGameFilterP2Logger()).map(this.mapToIds);
//     this.p2Loggers$ = this.store.let(getGameFilterP2Loggers()).map(this.mapToSelectedItems('Logger'));
//     this.p2LoggerLoading$ = this.store.let(getGameFilterP2LoggerState()).map(data => data.loading);
//     this.p2LoggerLoaded$ = this.store.let(getGameFilterP2LoggerState()).map(data => data.loaded);
//
//     this.p3Logger$ = this.store.let(getGameFilterP3Logger()).map(this.mapToIds);
//     this.p3Loggers$ = this.store.let(getGameFilterP3Loggers()).map(this.mapToSelectedItems('Logger'));
//     this.p3LoggerLoading$ = this.store.let(getGameFilterP3LoggerState()).map(data => data.loading);
//     this.p3LoggerLoaded$ = this.store.let(getGameFilterP3LoggerState()).map(data => data.loaded);*/
//
//     this.fromDate$ = this.store.let(getGameFilterFromDate());
//     this.toDate$ = this.store.let(getGameFilterToDate());
//
//     /*this.date$ = this.store.let(getGameFilterDate());
//     this.dueDate$ = this.store.let(getGameFilterDueDate());*/
//
//     this.jobTypesModel$ = this.store.let(getGameFilterJobType());
//     this.jobStatusesModel$ = this.store.let(getGameFilterJobStatus()).map(this.mapStaticEntities);
//     this.pbpModel$ = this.store.let(getGameFilterLineup());
//     this.dateSelectionModel$ = this.store.let(getGameFilterDateInterval());
//     this.gameOwner$ = this.store.let(getGameFilterGameOwner());
//     this.videoSource$ = this.store.let(getGameFilterVideoSources()).map(this.mapStaticEntities);
//     this.dataRangeEnabled$ = this.store.let(getGameFilterDateIntervalState());
//     this.first$ = this.store.let(this.getFirst());
//     this.gamePaging$ = this.store.let(getGameFilterPagingState());
//     this.sort$ = this.store.let(getGameFilterSortState())
//       .map(res => ({ field: res.field, order: res.order === 'asc' ? '1' : '-1' }));
//
//     this.page$ = this.gamePaging$.map(p => p.page);
//     this.size$ = this.gamePaging$.map(p => p.size);
//     this.total$ = this.gamePaging$.map(p => p.total);
//     this.rowsPerPageOptions$ = this.gamePaging$.map(p => p.rowsPerPageOptions);
//   }
//
//   ngOnDestroy() {
//     this.subscription.unsubscribe();
//     this.sub.unsubscribe();
//   }
//
//   isGameEdited(game) {
//     if (game.edited) {
//       return true;
//     }
//
//     return false;
//   }
//
//   loadGameTrackers(e: any) {
//     const paging = { page: (e.first / e.rows) + 1, size: e.rows };
//     const sort: { field: string, order: 'asc' | 'desc' } = {
//       field: this.mapSortFieldName(e.sortField),
//       order: e.sortOrder === 1 ? 'asc' : 'desc'
//     };
//
//     /*let textParamFilter;
//     if (!!(e.filters) && (e.filters.name || e.filters.missionId || e.filters.priority)) {
//       textParamFilter = {
//         name: e.filters.name ? e.filters.name.value : null,
//         missionId: e.filters.missionId ? e.filters.missionId.value : null,
//         priority: e.filters.priority ? e.filters.priority.value : null
//       };
//     } else {
//       textParamFilter = { name: null, missionId: null, priority: null };
//     }
//     this.store.dispatch(GamesActions.filterNameChanged(textParamFilter));*/
//
//     this.store.dispatch(GamesActions.sortChanged(sort));
//     this.store.dispatch(GamesActions.pageChanged(paging.page));
//     this.store.dispatch(GamesActions.sizeChanged(paging.size));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   onSearchIidKeyPressed(event) {
//     if (event.keyCode === 13) {
//       this.searchGameByIid();
//     }
//   }
//
//   searchGameByIid() {
//     let iid = Number(this.gameIid);
//     if (iid) {
//       this.store.dispatch(GamesActions.loadGameByIid(iid));
//     } else {
//       if (iid === 0) {
//         this.store.dispatch(GamesActions.search());
//         return;
//       }
//       this.notificationService.showError('Iid incorrect', 'Please enter iid in numeric format', 3);
//     }
//   }
//
//   clearAllFilters() {
//     this.store.dispatch(GamesActions.filterLeagueSelected([]));
//     this.store.dispatch(GamesActions.filterTeamSelected([]));
//     this.store.dispatch(GamesActions.filterConferenceSelected([]));
//     this.store.dispatch(GamesActions.filterDivisionSelected([]));
//     this.store.dispatch(GamesActions.filterCompetitionSelected([]));
//     this.store.dispatch(GamesActions.filterSeasonSelected([]));
//     this.store.dispatch(GamesActions.jobStatusChanged([]));
//     this.store.dispatch(GamesActions.jobTypeChanged(''));
//     this.store.dispatch(GamesActions.lineupsFilterChanged(''));
//     this.store.dispatch(GamesActions.gameOwnerChanged(''));
//     this.store.dispatch(GamesActions.videoSourceChanged([]));
//     this.store.dispatch(GamesActions.fromChanged(''));
//     this.store.dispatch(GamesActions.toChanged(''));
//     this.store.dispatch(GamesActions.dateIntervalChanged('7'));
//     this.store.dispatch(GamesActions.filterCreated(this.gameFilterOptions));
//     // this.store.dispatch(GamesActions.search());
//
//     /*this.store.dispatch(GamesActions.filterHomeTeamSelected([]));
//      this.store.dispatch(GamesActions.filterAwayTeamSelected([]));*/
//     /*this.store.dispatch(GamesActions.filterServerSelected([]));
//     this.store.dispatch(GamesActions.missionStatusChanged([]));
//     this.store.dispatch(GamesActions.filterP1LoggerSelected([]));
//     this.store.dispatch(GamesActions.filterP2LoggerSelected([]));
//     this.store.dispatch(GamesActions.filterP3LoggerSelected([]));
//     this.store.dispatch(GamesActions.dateChanged(''));
//     this.store.dispatch(GamesActions.dueDateChanged(''));
//     this.store.dispatch(GamesActions.filterNameChanged(''));
//     this.store.dispatch(GamesActions.filterPriorityChanged(''));
//     this.store.dispatch(GamesActions.filterMissionIdChanged(''));*/
//   }
//
//   mapGames(games: any[]) {
//     games.forEach(g => {
//       if (g.utc) {
//         const converted = DateTimeUtils.CreateDateFromUtcAndTimezone(g.utc, g.timeZone);
//         g.viewDate = `${moment(converted.date).format('MM/DD/YYYY')}`;
//         g.viewTime = `${moment(converted.date).format('HH:mm')} ${converted.timeZoneAbbr}`;
//         // g.viewDate = moment(g.utc).format('MM/DD/YYYY HH:mm');
//       } else {
//         g.viewDate = DateTimeUtils.ApiDateToString(g.date);
//         g.viewTime = '';
//       }
//       g.overallJobsStatus = Game.getGameJobsOverallStatus(g.jobs);
//       if (g.dueDate) {
//         g.dueDateValue = moment(g.dueDate).toDate();
//       }
//       if (g.encodingServer) {
//         g.server = g.encodingServer.name;
//       }
//       if (g.jobs) {
//         const jobPhase1 = g.jobs.filter(j => j.jobTypes === JobType.Phase1Logging)[0];
//         if (jobPhase1) {
//           g.p1Logger = jobPhase1.assignee ? jobPhase1.assignee.name : '';
//         }
//         const jobPhase2 = g.jobs.filter(j => j.jobTypes === JobType.Phase2Logging)[0];
//         if (jobPhase2) {
//           g.p2Logger = jobPhase2.assignee ? jobPhase2.assignee.name : '';
//         }
//         const jobPhase3 = g.jobs.filter(j => j.jobTypes === JobType.Phase3Logging)[0];
//         if (jobPhase3) {
//           g.p3Logger = jobPhase3.assignee ? jobPhase3.assignee.name : '';
//         }
//       }
//     });
//     return games;
//   }
//
//   p1LoggerName(game) {
//     const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase1Logging)[0];
//     return this.loggerName(job);
//   }
//
//   p2LoggerName(game) {
//     const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase2Logging)[0];
//     return this.loggerName(job);
//
//   }
//
//   p3LoggerName(game) {
//     const job = (game.jobs || []).filter(x => x.jobType === JobType.Phase3Logging)[0];
//     return this.loggerName(job);
//   }
//
//   loggerName(job) {
//     if (!!job && !!job.assignee) {
//       const assignee = job.assignee;
//       return `${assignee.first || ''} ${assignee.last || ''}`;
//     }
//
//     return '';
//   }
//
//   private mapSortFieldName(fieldName: string): string {
//     if (fieldName === 'viewDate') {
//       return 'date';
//     }
//     if (fieldName === 'dueDateValue') {
//       return 'dueDate';
//     }
//     return fieldName;
//   }
//
//   editInitiated(row) {
//     row.column.overflow = 'visible';
//   }
//
//   editCompleted(row) {
//     row.data.edited = true;
//     console.log(row.column);
//     console.log(row.data);
//     row.column.overflow = 'hidden';
//   }
//
//   editCanceled(row) {
//     console.log(row.column);
//     console.log(row.data);
//     row.column.overflow = 'hidden';
//     // row.data[row.column.field] = null;
//   }
//
//   onSaveRowChanges(game, edited) {
//     if (edited === true) {
//       game.saving = true;
//       // game.isDisable = true;
//       game.edited = false;
//       let dueDate = '';
//       if (game.dueDateValue) {
//         dueDate = moment(game.dueDateValue).format(DateTimeUtils.ServerDateTimeFormat);
//       }
//       const priority = game.priority;
//
//       // todo: refactor, hacky to get latest version of gameTracker entity
//       this.operationsService.getGameTracker(game.id)
//         .subscribe(res => {
//           res.dueDate = dueDate;
//           res.priority = priority;
//           res.videoSource = game.videoSource;
//           res.desiVersion = game.desiVersion;
//           res.encodingServer = game.encodingServer;
//           this.operationsService.putGameTracker(game.id, res)
//             .subscribe(_ => {
//               game.edited = false;
//               game.saving = false;
//               this.notificationService.showSuccess('Success');
//             }, err => {
//               game.saving = false;
//               this.notificationService.showError('Save failed.', err, 3);
//             });
//         }, err => {
//           game.saving = false;
//         });
//     } else {
//       game.edited = false;
//     }
//   }
//
//   dueDateSelected (game, date) {
//     game.dueDateValue = date;
//     game.edited = true;
//   }
//
//   prioritySelected(game, priority) {
//     game.priority = priority > 0 ? priority : undefined;
//     game.edited = true;
//   }
//
//   videoSourceSelected(game, videoSource) {
//     game.videoSource = videoSource;
//     game.edited = true;
//     // game.isDisable = false;
//   }
//
//   desiVersionSelected(game, desiVersion) {
//     game.desiVersion = desiVersion;
//     game.edited = true;
//     // game.isDisable = false;
//   }
//
//   onChange(game, edited) {
//     // game.isDisable = true;
//     game.edited = false;
//     this.onSaveRowChanges(game, edited);
//   }
//
//   serverFilterChanged(dt, event, field, filterMatchMode) {
//     if (this.isMouseClickEvent(event)) {
//       dt.filter(event.value, field, filterMatchMode);
//     }
//   }
//
//   onServerSelected(game, serverId) {
//     const server = this.serversFullInfo.filter(s => s.id === serverId)[0];
//     if (server) {
//       game.encodingServer = {
//         id: server.id,
//         iid: server.iid,
//         name: server.name
//       };
//       game.edited = true;
//     }
//   }
//
//   selectionVideoSourceChanged(ids) {
//     this.filter.addValues('videoSources', ids);
//     this.store.dispatch(GamesActions.videoSourceChanged(ids));
//   }
//
//   /*homeTeamTableFilterChanged(ids) {
//     this.filter.addValues('homeTeamIds', ids);
//     this.store.dispatch(GamesActions.filterHomeTeamSelected(ids));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   awayTeamTableFilterChanged(ids) {
//     this.filter.addValues('awayTeamIds', ids);
//     this.store.dispatch(GamesActions.filterAwayTeamSelected(ids));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   missionStatusChanged(ids) {
//     this.filter.addValues('missionStatusIds', ids);
//     this.store.dispatch(GamesActions.missionStatusChanged(ids));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   p1LoggerChanged(ids) {
//     this.filter.addValues('p1LoggerIds', ids);
//     this.store.dispatch(GamesActions.filterP1LoggerSelected(ids));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   p2LoggerChanged(ids) {
//     this.filter.addValues('p2LoggerIds', ids);
//     this.store.dispatch(GamesActions.filterP2LoggerSelected(ids));
//     this.store.dispatch(GamesActions.search());
//   }
//
//   p3LoggerChanged(ids) {
//     this.filter.addValues('p3LoggerIds', ids);
//     this.store.dispatch(GamesActions.filterP3LoggerSelected(ids));
//     this.store.dispatch(GamesActions.search());
//   }*/
//
//   selectionSportChanged(id) {
//     this.filter.setValue('sportId', id);
//     this.store.dispatch(GamesActions.filterSportSelected(id));
//   }
//
//   selectionLeagueChanged(ids) {
//     this.filter.addValues('leagueIds', ids);
//     this.store.dispatch(GamesActions.filterLeagueSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionDivisionChanged(ids) {
//     this.filter.addValues('divisionIds', ids);
//     this.store.dispatch(GamesActions.filterDivisionSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionConferenceChanged(ids) {
//     this.filter.addValues('conferenceIds', ids);
//     this.store.dispatch(GamesActions.filterConferenceSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionSeasonChanged(ids) {
//     this.filter.addValues('seasonIds', ids);
//     this.store.dispatch(GamesActions.filterSeasonSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionTeamChanged(ids) {
//     this.filter.addValues('teamIds', ids);
//     this.store.dispatch(GamesActions.filterTeamSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionCompetitionChanged(ids) {
//     this.filter.addValues('competitionIds', ids);
//     this.store.dispatch(GamesActions.filterCompetitionSelected(ids));
//     // this.store.dispatch(GamesActions.search());
//   }
//
//   selectionJobTypeChanged(id) {
//     this.filter.setValue('jobTypeId', id);
//     this.store.dispatch(GamesActions.jobTypeChanged(id));
//   }
//
//   selectionJobStatusChanged(ids) {
//     this.filter.addValues('jobStatusIds', ids);
//     this.store.dispatch(GamesActions.jobStatusChanged(ids));
//   }
//
//   selectionLineupChanged(id) {
//     this.filter.setValue('lineupId', id);
//     this.store.dispatch(GamesActions.lineupsFilterChanged(id));
//   }
//
//   selectionDateIntervalChanged(id) {
//     this.filter.setValue('gameIntervalId', id);
//     this.store.dispatch(GamesActions.dateIntervalChanged(id));
//   }
//
//   selectionGamesOwnerChanged(id) {
//     this.filter.setValue('gameOwnerId', id);
//     this.store.dispatch(GamesActions.gameOwnerChanged(id));
//   }
//
//   selectionChanged(source, date) {
//     if (source === 'from') {
//      this.filter.setValue('gameSelectedFrom', DateTimeUtils.stringifyDate(date));
//       this.store.dispatch(GamesActions.fromChanged(DateTimeUtils.stringifyDate(date)));
//     } else if (source === 'to') {
//       this.filter.setValue('gameSelectedTo', DateTimeUtils.stringifyDate(date));
//       this.store.dispatch(GamesActions.toChanged(DateTimeUtils.stringifyDate(date)));
//     } /*else if (source === 'date') {
//       this.filter.setValue('gameSelectedDate', date);
//       this.store.dispatch(GamesActions.dateChanged(DateTimeUtils.stringifyDate(date)));
//       this.store.dispatch(GamesActions.search());
//     } else if (source === 'dueDate') {
//       this.filter.setValue('gameSelectedDueDate', date);
//       this.store.dispatch(GamesActions.dueDateChanged(DateTimeUtils.stringifyDate(date)));
//       this.store.dispatch(GamesActions.search());
//     }*/
//   }
//
//   onBlurEvent(source, event) {
//     let strDate = event.target.value;
//     try {
//       let date = new Date(strDate);
//       if (source === 'from') {
//         this.filter.setValue('gameSelectedFrom', DateTimeUtils.stringifyDate(date));
//         this.store.dispatch(GamesActions.fromChanged(DateTimeUtils.stringifyDate(date)));
//       } else if (source === 'to') {
//         this.filter.setValue('gameSelectedTo', DateTimeUtils.stringifyDate(date));
//         this.store.dispatch(GamesActions.toChanged(DateTimeUtils.stringifyDate(date)));
//       } /*else if (source === 'date') {
//         this.filter.setValue('gameSelectedDate', date.toString());
//         this.store.dispatch(GamesActions.dateChanged(DateTimeUtils.stringifyDate(date)));
//         this.store.dispatch(GamesActions.search());
//       } else if (source === 'dueDate') {
//         this.filter.setValue('gameSelectedDueDate', date.toString());
//         this.store.dispatch(GamesActions.dueDateChanged(DateTimeUtils.stringifyDate(date)));
//         this.store.dispatch(GamesActions.search());
//       }*/
//     } catch (ex) {
//       this.notificationService.showError(
//         `Format of date calendar '${source}' is incorrect. Must be in format mm/dd/yyyy!`);
//     }
//   }
//
//   getFirst() {
//     return (state$: Observable<AppState>) => state$
//       .let(getGameFilterPagingState())
//       .map((p: Paging) => {
//         return (p.page - 1) * p.size;
//       });
//   }
//
//   paginate(p) {
//     this.store.dispatch(GamesActions.pageChanged(p.page + 1));
//     this.store.dispatch(GamesActions.sizeChanged(+p.rows));
//     this.store.dispatch(GamesActions.search());
//     console.log(p);
//   }
//
//   onRefreshClicked() {
//     this.store.dispatch(GamesActions.search());
//   }
//
//   onAdd() {
//     this.create.emit(true);
//     return false;
//   }
//
//   showMessage(value) {
//     console.log('item was changed to - ' + value);
//   }
//
//   onNavigate(params: any[]) {
//     this.router.navigate(params);
//   }
//
//   navigateToDetails(id) {
//     this.router.navigate(['/sport/games', id]);
//   }
//
//   onFilterChanged(event) {
//     let iid = event.filters.iid.value;
//     if (iid.length >= 6) {
//       iid = Number(iid);
//       if (iid) {
//         this.store.dispatch(GamesActions.loadGameByIid(iid));
//       } else {
//         this.notificationService.showError('Iid incorrect', 'Please enter iid in numeric format', 3);
//       }
//     }
//   }
//
//   onSelectItem(val) {
//     console.log(val);
//   }
//
//   onFocus(game) {
//     // game.isDisable = true;
//     game.edited = false;
//   }
//   onBlur(game) {
//     // game.isDisable = false;
//     game.edited = true;
//   }
//
//   onStartDateChange(val) {
//     console.log('start Date changed: ' + val);
//   }
//
//   onEndDateChange(val) {
//     console.log('end Date changed: ' + val);
//   }
//
//   mapToId(e: any) {
//     if (e) {
//       return e.id;
//     } else {
//       return '';
//     }
//   }
//
//   mapToIds(entities: any): string[] {
//     let ret: string[] = [];
//     if (entities) {
//       for (let entity of entities) {
//         if (entity) {
//           ret.push(entity.id);
//         }
//       }
//     }
//     return ret;
//   }
//
//   mapStaticEntities(entities: any): string[] {
//     let ret: string[] = [];
//     if (entities) {
//       for (let entity of entities) {
//         ret.push(entity);
//       }
//     }
//     return ret;
//   }
//
//   mapToSelectedItems(type) {
//     return (entities: any[]) => {
//       let r = [];
//       if (type === 'Sport') {
//         r = [{ label: `Select ${type}`, value: '' }];
//       }
//       entities.forEach(e => {
//         r.push({ label: e.name, value: e.id });
//         /*if (type === 'Logger') {
//           r.push({ label: e.first + ' ' + e.last, value: e.id });
//         } else {
//           r.push({ label: e.name, value: e.id });
//         }*/
//       });
//
//       return r;
//     };
//   }
//
//   fillFiltersFromUrl(result) {
//     const sportId = this.filter.getValue('sportId');
//     if (sportId) {
//       this.store.dispatch(GamesActions.filterSportSelected(sportId));
//     }
//     const leagueIds = this.filter.getValues('leagueIds');
//     if (leagueIds) {
//       this.store.dispatch(GamesActions.filterLeagueSelected(leagueIds));
//     }
//     const divisionIds = this.filter.getValues('divisionIds');
//     if (divisionIds) {
//       this.store.dispatch(GamesActions.filterDivisionSelected(divisionIds));
//     }
//     const conferenceIds = this.filter.getValues('conferenceIds');
//     if (conferenceIds) {
//       this.store.dispatch(GamesActions.filterConferenceSelected(conferenceIds));
//     }
//     const teamIds = this.filter.getValues('teamIds');
//     if (teamIds) {
//       this.store.dispatch(GamesActions.filterTeamSelected(teamIds));
//     }
//     const competitionIds = this.filter.getValues('competitionIds');
//     if (competitionIds) {
//       this.store.dispatch(GamesActions.filterCompetitionSelected(competitionIds));
//     }
//     const seasonIds = this.filter.getValues('seasonIds');
//     if (seasonIds) {
//       this.store.dispatch(GamesActions.filterSeasonSelected(seasonIds));
//     }
//     const jobType = this.filter.getValue('jobTypeId');
//     if (jobType) {
//       this.store.dispatch(GamesActions.jobTypeChanged(jobType));
//     }
//     const jobStatuses = this.filter.getValues('jobStatusIds');
//     if (jobStatuses) {
//       this.store.dispatch(GamesActions.jobStatusChanged(jobStatuses));
//     }
//     const videoSources = this.filter.getValues('videoSources');
//     if (videoSources) {
//       this.store.dispatch(GamesActions.videoSourceChanged(videoSources));
//     }
//     /*const missionStatuses = this.filter.getValues('missionStatusIds');
//     if (missionStatuses) {
//       this.store.dispatch(GamesActions.missionStatusChanged(missionStatuses));
//     }*/
//     const lineup = this.filter.getValue('lineupId');
//     if (lineup) {
//       this.store.dispatch(GamesActions.lineupsFilterChanged(lineup));
//     }
//     /*const homeTeam = this.filter.getValues('homeTeamIds');
//     if (homeTeam) {
//       this.store.dispatch(GamesActions.filterHomeTeamSelected(homeTeam));
//     }
//     const awayTeam = this.filter.getValues('awayTeamIds');
//     if (awayTeam) {
//       this.store.dispatch(GamesActions.filterAwayTeamSelected(awayTeam));
//     }
//     const server = this.filter.getValues('serverIds');
//     if (server) {
//       this.store.dispatch(GamesActions.filterServerSelected(server));
//     }
//     const p1Logger = this.filter.getValues('p1LoggerIds');
//     if (p1Logger) {
//       this.store.dispatch(GamesActions.filterP1LoggerSelected(p1Logger));
//     }
//     const p2Logger = this.filter.getValues('p2LoggerIds');
//     if (p2Logger) {
//       this.store.dispatch(GamesActions.filterP2LoggerSelected(p2Logger));
//     }
//     const p3Logger = this.filter.getValues('p3LoggerIds');
//     if (p3Logger) {
//       this.store.dispatch(GamesActions.filterP3LoggerSelected(p3Logger));
//     }*/
//     const from = this.filter.getValue('gameSelectedFrom');
//     if (from) {
//       this.store.dispatch(GamesActions.fromChanged(from));
//     }
//     const to = this.filter.getValue('gameSelectedTo');
//     if (to) {
//       this.store.dispatch(GamesActions.toChanged(to));
//     }
//     /*const date = this.filter.getValue('gameSelectedDate');
//     if (date) {
//       this.store.dispatch(GamesActions.toChanged(date));
//     }
//     const dueDate = this.filter.getValue('gameSelectedDueDate');
//     if (dueDate) {
//       this.store.dispatch(GamesActions.toChanged(dueDate));
//     }*/
//     const dateInterval = this.filter.getValue('gameIntervalId');
//     if (dateInterval) {
//       this.store.dispatch(GamesActions.dateIntervalChanged(dateInterval));
//     }
//     const gameOwner = this.filter.getValue('gameOwnerId');
//     if (gameOwner) {
//       this.store.dispatch(GamesActions.gameOwnerChanged(gameOwner));
//     }
//   }
//
//   private isMouseClickEvent(event) {
//     return event.originalEvent.type === 'click';
//   }
//
//   private loadServers() {
//     this.operationsService.getServers()
//       .map((res: any) => res.result)
//       .mergeMap((entities: any[]) => {
//         let servers = [{ label: 'Select Server', value: '' }];
//         for (let entity of entities) {
//           servers.push({ label: entity.name, value: entity.id });
//         }
//         return Observable.of(servers);
//       }, (serverResult, nextResult) => ({ fullResult: serverResult, nextRes: nextResult }))
//       .subscribe((res: any) => {
//         this.servers = res.nextRes;
//         this.serversFullInfo = res.fullResult;
//       }, error => {
//         this.notificationService.showError('Error while loading servers', error);
//       });
//   }
// }
