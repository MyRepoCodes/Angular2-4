// import { Component, OnInit, Input, OnDestroy } from '@angular/core';
// import { Subscription, Observable } from 'rxjs';
// import { Router } from '@angular/router';
// import { AppState } from '../../app.state';
// import { PgaFilterEffects } from './pga-filter.effects';
// import { Store } from '@ngrx/store';
// import { mergeEffects } from '@ngrx/effects';
// import { PgaActions } from './pga.actions';
// import { getCollection, getCollectionLoading } from '../../shared/reducers';
// import {
//   getSelectedSport, getSports, getSelectedLeagues, getLeagues, getCompetitions,
//   getSelectedCompetition, getSelectedPhase, getPhases, getPaging, getFrom, getTo
// } from './index';
// import { Paging } from '../../shared/reducers';
// import * as moment from 'moment';
// import { DateTimeUtils } from '../../shared/utils';
//
// @Component({
//   selector: 'sn-pga',
//   template: `
// <div class="ui-g-12 ui-fluid">
//   <div class="ui-g-2">
//     <p-dropdown
//       [options]="sports$ | async"
//       [ngModel]="sport$ | async"
//       (onChange)="selectionSportChanged($event.value)"
//       [autoWidth]="false"
//     ></p-dropdown>
//   </div>
//   <div class="ui-g-2">
//     <p-multiSelect
//       [options]="leagues$ | async"
//       [ngModel]="league$ | async"
//       (onChange)="selectionLeaguesChanged($event.value)"
//     ></p-multiSelect>
//   </div>
//
//   <div class="ui-g-2">
//     <p-dropdown
//       [options]="competitions$ | async"
//       [ngModel]="competition$ | async"
//       (onChange)="selectionCompetitionChanged($event.value)"
//       [autoWidth]="false"
//     ></p-dropdown>
//   </div>
//   <div class="ui-g-2">
//     <p-dropdown
//       [options]="phases$ | async"
//       [ngModel]="phase$ | async"
//       (onChange)="selectionPhaseChanged($event.value)"
//       [autoWidth]="false"
//     ></p-dropdown>
//   </div>
//   <div class="ui-g-3"></div>
//   <div class="ui-g-1">
//     <button pButton type="button" label="Search" (click)="onSearch()"></button>
//   </div>
// </div>
//
// <div class="ui-g-12 ui-fluid">
//   <div class="ui-g-3">
//     From:
//     <p-calendar
//       [ngModel]="fromDate$ | async"
//       [placeholder]="'Start date'"
//       [showIcon]="true"
//       (onSelect)="selectionFromDateChanged($event)"
//     ></p-calendar>
//   </div>
//   <div class="ui-g-3">
//     To:
//     <p-calendar
//       [styleClass]="'sn-no-text-opacity'"
//       [disabled]="true"
//       [ngModel]="toDate$ | async"
//       [placeholder]="'End date'"
//       [showIcon]="true"
//       (onSelect)="selectionToDateChanged($event)"
//     ></p-calendar>
//   </div>
// </div>
//
// <div class="ui-g-12 ui-g-nopad">
//   <sn-table
//     [data]="pga$ | async"
//     [first]="first$ | async"
//     [page]="page$ | async"
//     [size]="size$ | async"
//     [total]="total$ | async"
//     [rowsPerPage]="rowsPerPageOptions$ | async"
//     (paginate)="paginate($event)"
//   ></sn-table>
// </div>
//
// `
// //   <p-dataTable [value]="pga$ | async" [headerRows]="headerRows()" styleClass="sn-pga"
// //   [rows]="10" [paginator]="true" [pageLinks]="3" [rowsPerPageOptions]="[5,10,20]">
// // <p-column
// // *ngFor="let col of cols();"
// //   [field]="col.name" [styleClass]="col.styleClass"
// //   ></p-column>
// //   </p-dataTable>
// })
// export class PgaContainer implements OnInit, OnDestroy {
//   @Input() sportId: string;
//   @Input() leagueIds: string[];
//   @Input() phase: string;
//   @Input() competitionId: string;
//   @Input() from: string;
//   @Input() to: string;
//   @Input() page: number;
//   @Input() size: number;
//
//   pga$;
//   loading$;
//
//   phase$;
//   phases$;
//   sport$;
//   sports$;
//   league$;
//   leagues$;
//   competition$;
//   competitions$;
//
//   fromDate$;
//   toDate$;
//
//   pgaPaging$;
//   first$;
//   page$;
//   size$;
//   total$;
//   rowsPerPageOptions$;
//
//   private subscription: Subscription;
//
//   constructor(
//     private pgaFilterEffects: PgaFilterEffects,
//     public store: Store<AppState>,
//     public router: Router
//   ) {
//     this.subscription = mergeEffects(pgaFilterEffects).subscribe(store);
//   }
//
//   selectionFromDateChanged(from) {
//     let fromDate = moment(from, DateTimeUtils.CalendarDateFormat);
//     let toDate = fromDate.clone().add(6, 'd');
//     this.store.dispatch(PgaActions.fromChanged(fromDate.format(DateTimeUtils.CalendarDateFormat)));
//     this.store.dispatch(PgaActions.toChanged(toDate.format(DateTimeUtils.CalendarDateFormat)));
//   }
//
//   selectionToDateChanged(to) {
//     this.store.dispatch(PgaActions.toChanged(to));
//   }
//
//   selectionSportChanged(id) {
//     this.store.dispatch(PgaActions.filterSportSelected(id));
//   }
//
//   selectionLeaguesChanged(id) {
//     this.store.dispatch(PgaActions.filterLeaguesSelected(id));
//   }
//
//   selectionCompetitionChanged(id) {
//     this.store.dispatch(PgaActions.filterCompetitionSelected(id));
//   }
//
//   selectionPhaseChanged(id) {
//     this.store.dispatch(PgaActions.filterPhaseSelected(id));
//   }
//
//   ngOnInit() {
//
//     this.store.dispatch(PgaActions.filterCreated(
//       this.sportId, this.leagueIds, this.competitionId, this.phase, this.from, this.to,
//       this.page, this.size)
//     );
//     this.store.dispatch(PgaActions.search());
//
//     this.pga$ = this.store.let(getCollection('pga')).switchMap(this.mapToLoggers());
//     this.loading$ = this.store.let(getCollectionLoading('pga'));
//
//     this.sport$ = this.store.let(getSelectedSport()).switchMap(this.mapToId);
//     this.sports$ = this.store.let(getSports()).switchMap(this.mapToSelectedItems('Sport'));
//
//     this.league$ = this.store.let(getSelectedLeagues()).switchMap(this.mapToCollectionIds());
//     this.leagues$ = this.store.let(getLeagues()).switchMap(this.mapToSelectedItemsNoEmpty('League'));
//
//     this.competition$ = this.store.let(getSelectedCompetition()).switchMap(this.mapToId);
//     this.competitions$ = this.store.let(getCompetitions()).switchMap(this.mapToSelectedItems('Competition'));
//
//     this.phase$ = this.store.let(getSelectedPhase()).switchMap(this.mapToId);
//     this.phases$ = this.store.let(getPhases()).switchMap(this.mapToSelectedItems('Phase'));
//
//     this.fromDate$ = this.store.let(getFrom());
//     this.toDate$ = this.store.let(getTo());
//
//     this.first$ = this.store.let(this.getFirst());
//     this.pgaPaging$ = this.store.let(getPaging());
//     this.page$ = this.pgaPaging$.map(p => p.page);
//     this.size$ = this.pgaPaging$.map(p => p.size);
//     this.total$ = this.pgaPaging$.map(p => p.total);
//     this.rowsPerPageOptions$ = this.pgaPaging$.map(p => p.rowsPerPageOptions);
//   }
//
//   getFirst() {
//     return (state$: Observable<AppState>) => state$
//       .let(getPaging())
//       .switchMap((p: Paging) => {
//         return Observable.of((p.page - 1) * p.size);
//       });
//   }
//
//   ngOnDestroy() {
//     this.subscription.unsubscribe();
//   }
//
//   paginate(p) {
//     this.store.dispatch(PgaActions.pageChanged(p.page + 1));
//     this.store.dispatch(PgaActions.sizeChanged(+p.rows));
//     this.store.dispatch(PgaActions.search());
//     console.log(p);
//   }
//
//   onSearch() {
//     this.store.dispatch(PgaActions.search());
//   }
//
//   reload() {
//     this.onSearch();
//   }
//
//   mapToId(e: any) {
//     if (e) {
//       return Observable.of(e.id);
//     } else {
//       return Observable.of('');
//     }
//   }
//
//   mapToCollectionIds() {
//     return (entities: any[]) => {
//       let r = [];
//       entities.forEach(e => {
//         r.push(e.id);
//       });
//       return Observable.of(r);
//     };
//   }
//
//   mapToSelectedItems(type) {
//     return (entities: any[]) => {
//       let r = [{ label: `Select ${type}`, value: '' }];
//       entities.forEach(e => {
//         r.push({ label: e.name, value: e.id });
//       });
//       return Observable.of(r);
//     };
//   }
//
//   mapToSelectedItemsNoEmpty(type) {
//     return (entities: any[]) => {
//       let r = [];
//       entities.forEach(e => {
//         r.push({ label: e.name, value: e.id });
//       });
//       return Observable.of(r);
//     };
//   }
//
//   mapToLoggers() {
//     return (entities: any[]) => {
//       let r = [];
//       entities.forEach(pga => {
//         let logger: any[] = [];
//         let i = 0;
//         logger[0] = pga.logger.id;
//         logger[i++] = pga.logger.name;
//
//         const emptyVal = { h: 0, g: 0, gh: 0 };
//         let calculate = (acc, cur) => {
//           return {
//             h: acc.h + cur.seconds / 3600,
//             g: acc.g + cur.games
//           };
//         };
//
//         let data: Map<string, any> = new Map<string, any>();
//         data.set('total', pga.data.reduce(calculate, emptyVal));
//         data.set('sat', pga.data.filter(d => new Date(d.date).getUTCDay() === 6).reduce(calculate, emptyVal));
//         data.set('sun', pga.data.filter(d => new Date(d.date).getUTCDay() === 0).reduce(calculate, emptyVal));
//         data.set('mon', pga.data.filter(d => new Date(d.date).getUTCDay() === 1).reduce(calculate, emptyVal));
//         data.set('tue', pga.data.filter(d => new Date(d.date).getUTCDay() === 2).reduce(calculate, emptyVal));
//         data.set('wed', pga.data.filter(d => new Date(d.date).getUTCDay() === 3).reduce(calculate, emptyVal));
//         data.set('thu', pga.data.filter(d => new Date(d.date).getUTCDay() === 4).reduce(calculate, emptyVal));
//         data.set('fri', pga.data.filter(d => new Date(d.date).getUTCDay() === 5).reduce(calculate, emptyVal));
//
//         data.forEach((v, k) => {
//           // logger[k + '_' + 'g'] = v.g;
//           // logger[k + '_' + 'h'] = v.h;
//           // logger[k + '_' + 'gh'] = (v.h > 0 && v.g > 0) ? v.g / v.h : 0;
//
//           logger[i++] = v.g.toFixed(2);
//           logger[i++] = v.h.toFixed(2);
//           logger[i++] = ((v.h > 0 && v.g > 0) ? v.g / v.h : 0).toFixed(2);
//         });
//
//         r.push(logger);
//       });
//       return Observable.of(r);
//     };
//   }
//
//   public cols() {
//     return [
//       { name: 'name', styleClass: 'sn-border-right' },
//       { name: 'total_g', styleClass: '' },
//       { name: 'total_h', styleClass: '' },
//       { name: 'total_gh', styleClass: 'sn-border-right' },
//       { name: 'sat_g', styleClass: '' },
//       { name: 'sat_h', styleClass: '' },
//       { name: 'sat_gh', styleClass: 'sn-border-right' },
//       { name: 'sun_g', styleClass: '' },
//       { name: 'sun_h', styleClass: '' },
//       { name: 'sun_gh', styleClass: 'sn-border-right' },
//       { name: 'mon_g', styleClass: '' },
//       { name: 'mon_h', styleClass: '' },
//       { name: 'mon_gh', styleClass: 'sn-border-right' },
//       { name: 'tue_g', styleClass: '' },
//       { name: 'tue_h', styleClass: '' },
//       { name: 'tue_gh', styleClass: 'sn-border-right' },
//       { name: 'wed_g', styleClass: '' },
//       { name: 'wed_h', styleClass: '' },
//       { name: 'wed_gh', styleClass: 'sn-border-right' },
//       { name: 'thu_g', styleClass: '' },
//       { name: 'thu_h', styleClass: '' },
//       { name: 'thu_gh', styleClass: 'sn-border-right' },
//       { name: 'fri_g', styleClass: '' },
//       { name: 'fri_h', styleClass: '' },
//       { name: 'fri_gh', styleClass: '' },
//     ];
//   }
//
//   headerRows() {
//     const ghHeader = [
//       { header: 'G' },
//       { header: 'H' },
//       { header: 'G/H', styleClass: 'sn-border-right' },
//     ];
//
//     const ghHeaderNoBorder = [
//       { header: 'G' },
//       { header: 'H' },
//       { header: 'G/H' },
//     ];
//
//     return [
//       {
//         columns: [
//           { header: 'Name', rowspan: 2, styleClass: 'sn-border-right sn-wide' },
//           { header: 'Total', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Sat', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Sun', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Mon', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Tue', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Wed', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Thu', colspan: 3, styleClass: 'sn-border-right' },
//           { header: 'Fri', colspan: 3 },
//         ]
//       },
//       {
//         columns: [
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeader,
//           ...ghHeaderNoBorder,
//         ]
//       }
//     ];
//   }
// }
//
