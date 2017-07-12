// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import * as moment from 'moment';
// import { DateTimeUtils } from '../../shared/utils';
//
// @Component({
//     selector: 'sn-pga-route',
//     template: `
// <sn-page [title]="'Post Game Analysis'">
//   <div content="body">
//     <sn-pga class="ui-g"
//       [sportId]="sportId"
//       [leagueIds]="leagueIds"
//       [competitionId]="competitionId"
//       [phase]="phase"
//       [from]="from"
//       [to]="to"
//       [page]="page"
//       [size]="size"
//     ></sn-pga>
//   </div>
// </sn-page>
// `
// })
// export class PgaRoute implements OnInit {
//   sportId: string;
//   leagueIds: string[];
//   phase: string;
//   competitionId: string;
//   from: string;
//   to: string;
//   page: number;
//   size: number;
//
//   constructor(
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//   }
//
//   ngOnInit() {
//     let lastSaturday = moment().day(-1);
//     let nextFriday = moment().day(5);
//     this.route.params.subscribe(params => {
//       this.sportId = params['sportId'] || '570aaedc46c5d11de0f8c0bc'; // todo: use sport name instead
//       this.leagueIds = params['leagueIds'] || [];
//       this.phase = params['phase'] || 'phase1';
//       this.competitionId = params['competitionId'];
//       this.from = params['from'] || DateTimeUtils.stringifyMomentDate(lastSaturday);
//       this.to = params['to'] || DateTimeUtils.stringifyMomentDate(nextFriday);
//     });
//   }
// }
