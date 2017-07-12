import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerStatisticsService } from './server-statistics.service';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/primeng';
import { HttpSportService } from '../../shared/services';

@Component({
  selector: 'sn-server-statistics',
  template: `
<sn-page [title]="'Server encoding statistic'">

  <div content="body">
    <sn-server-list
      [encodersData]="items"
      [loaded]="loaded"
      [leagues]="leagues$ | async"
      [leagueId]="leagueId"
      (refresh)="onRefresh()"
      (selectedLeague)="onLeagueSelected($event)"
      (loadServers)="loadServers($event)"
      (loadGames)="loadGames($event)">
    </sn-server-list>
  </div>
  
</sn-page>
`
})
export class ServerStatisticsComponent implements OnInit, OnDestroy {
  items;
  loaded = false;
  refreshInterval = 60000;
  timer;
  subscription;
  league$;
  leagues$;
  leagueId = '';
  private sub: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private sportService: HttpSportService,
              private serverStatisticsService: ServerStatisticsService) {
  }

  ngOnInit() {
    this.sub = this.route.params
      .map(p => p['leagueId'])
      .mergeMap(
        leagueId => this.serverStatisticsService.loadDataCenters(leagueId),
        (leagueId, result) => ({leagueId: leagueId, result: result})
      )
      .subscribe(result => {
        this.leagueId = result.leagueId;
        this.items = result.result;
        this.loaded = true;
      });

    this.sportService.getLeagues().subscribe(data => {
      this.leagues$ = this.getLeaguesPopulated(data.result);
    });

    this.timer = setInterval(() => {
      this.update(this.leagueId);
    }, this.refreshInterval);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
    clearInterval(this.timer);
  }

  update(leagueId) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.loaded = false;
    this.subscription = this.serverStatisticsService.loadDataCenters(leagueId).subscribe(data => {
      this.items = data;
      this.loaded = true;
    });
  }

  loadServers(dataCenter) {
    this.serverStatisticsService.loadServersByDataCenter(dataCenter.data.ServerName, this.leagueId).subscribe(data => {
      data.forEach(e => dataCenter.children.push(e));
    });
  }

  loadGames(server) {
    this.serverStatisticsService.loadGamesByServer(server.data.ServerName, this.leagueId).subscribe(data => {
      data.forEach(e => server.children.push(e));
    });
  }

  onRefresh() {
    let searchParams = {};
    if (this.leagueId) {
      searchParams = { leagueId: this.leagueId };
    }
    this.router.navigate(['../statistics', searchParams], {relativeTo: this.route});
  }

  onLeagueSelected(leagueId) {
    this.leagueId = leagueId;
  }

  getLeaguesPopulated(leagues) {
    let leagueItems: SelectItem[];
    leagueItems = [{ label: `Select League`, value: '' }];
    leagues.forEach(league => {
      leagueItems.push({ label: league.name, value: league.id });
    });
    return Observable.of(leagueItems);
  };
}
