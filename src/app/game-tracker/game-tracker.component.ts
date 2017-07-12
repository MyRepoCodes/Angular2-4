import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sn-game-tracker',
  template: `
<sn-page [title]="title" class="gameHeadre">  
  <div class="ui-g gamelistloader" content="body">
    <div class="ui-g-12">
      <sn-loading-status [loading]="loading" content="loading"></sn-loading-status>
    </div>
    <sn-game-tracker-list class="ui-g-12"
      [gameFilterOptions]="gameFilterOptions"
      (loading)="onLoadingChanged($event)"
      (refresh)="navigateToGames()"
      (create)="createNewGame()">
    </sn-game-tracker-list>
  </div>  
</sn-page>
`
})
export class GameTrackerRouterComponent implements OnInit, OnDestroy {
  gameFilterOptions;
  loading;
  public title: string;
  private sub: any;

  constructor(private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.title = 'Games List';
    this.sub = this.route.queryParams.subscribe(params => {
      this.gameFilterOptions = {};
      [
        'sportId', 'leagueIds', 'conferenceIds', 'divisionIds', 'teamIds', 'competitionIds', 'seasonIds', 'jobTypeId',
        'jobStatusIds', 'lineupId', 'gameOwnerId', 'videoSources', 'gameSelectedFrom', 'gameSelectedTo',
        'dateIntervalId', 'sortField', 'sortOrder'
      ].forEach(paramName => {
        this.gameFilterOptions[paramName] = params[paramName];
      });
    });
  }

  onLoadingChanged(loading) {
    this.loading = loading;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  navigateToGames() {
    this.router.navigate(['/sport/games/list']);
  }

  createNewGame() {
    this.router.navigate(['/sport/games/create']);
  }
}
