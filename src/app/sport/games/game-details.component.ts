import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectButton } from 'primeng/primeng';
import { HttpSportService } from '../../shared/services/sport.service';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';

@Component({
  selector: 'sn-game-details',
  template: `
    <div class="ui-g">

      <div *ngIf="game" class="ui-g-12">
        <p-dataTable [value]="gameDetails" class="ui-datatable-header ui-widget-header ui-corner-top">
          <p-column field="id" header="GameID"></p-column>
          <p-column field="date" header="Date" class="Container20"></p-column>
          <p-column field="homeTeam" header="Home Team"></p-column>
          <p-column field="awayTeam" header="Away Team"></p-column>
          <p-column field="league" header="League" class="Container25"></p-column>
          <p-column field="sport" header="Sport"></p-column>
          <p-column field="timeRemaining" header="Time Remaining"></p-column>
          <p-column field="status" header="Status"></p-column>
          <p-column field="comment" header="External Comment"></p-column>
        </p-dataTable>
      </div>

      <div class="ui-g-12">
        <p-selectButton #selBut [options]="viewTypes" [tabindex]="6"
                        (onChange)="gameDetailsTabChange($event)" [(ngModel)]="selectedItem"
        ></p-selectButton>
      </div>

      <sn-game-lineup-component class="ui-g-12" *ngIf="isLineup && gpLoaded"
                                [gameId]="gameId"
                                [game]="game"
      ></sn-game-lineup-component>

      <sn-game-events-component class="ui-g-12" *ngIf="isEvents && gpLoaded && atbatLoaded && actionLoaded"
                                [inningNumber]="inningNumber"
                                [atbatevents]="atbatEvents"
                                [actionevents]="actionEvents"
                                [gameplayers]="gamePlayers"
                                (inningCalling)="inningSet($event)">
      </sn-game-events-component>

      <sn-game-jobs class="ui-g-12" *ngIf="isJobs"
                    [gameId]="gameId"
                    [gameIid]="game?.iid">
      </sn-game-jobs>

      <!--<sn-ticket [filter] ="filter" *ngIf="isTicket">-->
      <!---->
      <!--</sn-ticket>-->
      <div class="ui-g-12" *ngIf="isTicket">
        <sn-tickets [filter] = "filter"></sn-tickets>
      </div>

    </div>
  `
})
export class GameDetailsComponent implements OnInit, AfterViewInit {
  // @Input() game;
  // @Input() loading: boolean;
  // @Input() gameDetails;
  // @Input() gameId;

  // @Input() gameplayers;

  // @Input() atbatevents: any[];
  // @Input() actionevents: any[];

  // @Input() atbatLoading;
  // @Input()
  atbatLoaded = false;

  // @Input() actionLoading;
  // @Input()
  actionLoaded = false;

  // @Input() gpLoading;
  // @Input()
  gpLoaded = false;

  // @Output() loadLineups = new EventEmitter(false);
  // @Output() loadEvents = new EventEmitter(false);
  // @Output() loadInnings = new EventEmitter(false);
  // @Output() loadJobs = new EventEmitter(false);

  gameId: string;
  game;
  gameDetails;

  gamePlayers = [];
  atbatEvents = [];
  actionEvents = [];

  viewTypes: any[];
  selectedItem = 'jobs';
  isLineup = false;
  isEvents = false;
  isJobs = false;
  isTicket = false;
  inningNumber = 1;
  filter = {
    linkType: '',
    linkRef: ''
  };

  @ViewChild('selBut') selectButton: SelectButton;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sportService: HttpSportService
  ) {
    this.viewTypes = [];
    this.viewTypes.push({ label: 'Logging', value: 'logging' });
    this.viewTypes.push({ label: 'Lineups', value: 'lineups' });
    this.viewTypes.push({ label: 'HyperAssets', value: 'hyperassets' });
    this.viewTypes.push({ label: 'PbP', value: 'pbp' });
    this.viewTypes.push({ label: 'Tickets', value: 'tickets' });
    this.viewTypes.push({ label: 'Events', value: 'events' });
    this.viewTypes.push({ label: 'Jobs', value: 'jobs' });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameId = params['id'];

      // load game
      this.sportService.getGameById(this.gameId).subscribe(result => {
        const g = result.result;
        this.game = g;
        this.filter.linkRef = g.id;
        this.filter.linkType = 'Games';
        const gd = {
          id: g.iid + ' | ' + g.name,
          date: DateTimeUtils.ApiDateToString(g.date),
          homeTeam: g.homeTeam.name,
          awayTeam: g.awayTeam.name,
          league: g.league.name,
          sport: g.sport.id,
          timeRemaining: g.duration,
          status: '',
          comment: 'It was amazing game!'
        };
        this.gameDetails = [gd];
      });
    });
    this.isJobs = true;
  }

  ngAfterViewInit() {
    // this.selectButton.onItemClick({value: 'jobs'}, {label: 'Jobs', value: 'jobs'});
  }

  inningSet(event) {
    this.actionEvents = this.getFilteredActions(this.actionEvents, event);
    this.inningNumber = event;
  }

  getFilteredActions(actionEvents, inningNum) {
    let filtered = actionEvents;
    if (inningNum !== -1) {
      filtered = actionEvents.filter(action => action.inningNum === inningNum);
    }
    return filtered;
  }

  gameDetailsTabChange(event) {
    if (event.value === 'lineups') {
      this.isLineup = true;
      this.isEvents = false;
      this.isJobs = false;
      this.isTicket = false;
      this.sportService.getLineupByGame(this.gameId).subscribe(result => {
        this.gamePlayers = result;
        this.gpLoaded = true;
      });
    } else if (event.value === 'events') {
      this.isEvents = true;
      this.isLineup = false;
      this.isJobs = false;
      this.isTicket = false;
      this.sportService.getActionEventsByGame(this.gameId).subscribe(result => {
        this.actionEvents = result.result;
        this.actionLoaded = true;
      });
      this.sportService.getAtbatEventsByGame(this.gameId).subscribe(result => {
        this.atbatEvents = result.result;
        this.atbatLoaded = true;
      });
    } else if (event.value === 'tickets') {
      this.isTicket = true;
      this.isJobs = false;
      this.isEvents = false;
      this.isLineup = false;
    } else if (event.value === 'jobs') {
      this.isTicket = false;
      this.isJobs = true;
      this.isEvents = false;
      this.isLineup = false;
    } else {
      this.isTicket = false;
      this.isLineup = false;
      this.isEvents = false;
      this.isJobs = false;
    }
  }
}
