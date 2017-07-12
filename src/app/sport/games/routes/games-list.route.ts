// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router, UrlSerializer, ActivatedRoute } from '@angular/router';
//
// @Component({
//   selector: 'sn-games-list-route',
//   template: `
// <sn-page [title]="title" class="gameHeadre">
//   <div class="ui-g gamelistloader" content="body">
//     <div class="ui-g-12">
//       <sn-loading-status [loading]="loading" content="loading"></sn-loading-status>
//     </div>
//     <sn-games-list-container class="ui-g-12"
//       [gameFilterOptions]="gameFilterOptions"
//       (loading)="onLoadingChanged($event)"
//       (refresh)="navigateToGames()"
//       (create)="createNewGame()">
//     </sn-games-list-container>
//   </div>
// </sn-page>
// `
// })
// export class GamesListRoute implements OnInit, OnDestroy {
//   gameFilterOptions;
//   loading;
//   public title: string;
//   private sub: any;
//
//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private serializer: UrlSerializer
//   ) {
//   }
//
//   ngOnInit() {
//     this.title = 'Games List';
//     this.sub = this.route.params.subscribe(params => {
//       this.gameFilterOptions = {};
//       [
//         'sportId', 'leagueIds', 'divisionIds', 'conferenceIds', 'seasonIds', 'teamIds', 'competitionIds', 'from', 'to',
//         'jobType', 'jobStatus', 'lineup', 'dateInterval', 'page', 'size'
//       ].forEach(paramName => {
//         this.gameFilterOptions[paramName] = params[paramName];
//       });
//     });
//   }
//
//   onLoadingChanged(loading) {
//     this.loading = loading;
//   }
//
//   ngOnDestroy() {
//     this.sub.unsubscribe();
//   }
//
//   navigateToGames() {
//     this.router.navigate(['/sport/games/list']);
//   }
//
//   createNewGame() {
//     this.router.navigate(['/sport/games/create']);
//   }
// }
