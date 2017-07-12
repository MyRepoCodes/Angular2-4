import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges } from '@angular/core';
import { TreeNode } from 'primeng/primeng';

declare var jwplayer: any;

@Component({
  selector: 'sn-game-events-component',
  template: `
    <div class="Card" *ngIf="loading">
      <div class="Fright">
        Innings: <span (click)="inningClick($event)" style="cursor: pointer" *ngFor="let number of inningCount">
                   {{number}} | 
                 </span>
      </div>
      <div class="ui-grid-row"></div>
      <div class="TexAlCenter"><h3>{{topInningTeamName}} - Top of {{inningNumber}}st</h3></div>
      <div class="TexAlCenter"><h4>{{topInningPitcher}} pitching for {{bottomInningTeamName}}</h4></div>
      <p-treeTable [value]="topTeamEvents" selectionMode="single" (onNodeSelect)="nodeSelect($event)" 
        class="ui-treetable-resizable ui-widget">
        <p-column styleClass="col-button" [style]="{'width':'60px'}">
          <ng-template let-detail="rowData" pTemplate type="body">
            <button type="button" pButton (click)="showDetails(detail)" icon="fa-search"></button>
          </ng-template>
        </p-column>
        <p-column field="description" header="Desciption"></p-column>
        <p-column field="p1stBase" header="Player 1st base" [style]="{'width':'120px', 'text-align':'center'}"></p-column>
        <p-column field="outs" header="Outs" [style]="{'width':'50px'}"></p-column>
        <p-column field="runs" header="Runs" [style]="{'width':'50px'}"></p-column>
        <p-column field="balls" header="Balls" [style]="{'width':'50px'}"></p-column>
        <p-column field="strikes" header="Strikes" [style]="{'width':'60px'}"></p-column>
        <p-column field="homeTeamScore" header="{{bottomInningTeamAbbr}}" [style]="{'width':'35px'}"></p-column>
        <p-column field="awayTeamScore" header="{{topInningTeamAbbr}}" [style]="{'width':'35px'}"></p-column>
      </p-treeTable>
      <div class="TexAlCenter"><h3>{{bottomInningTeamName}} - Bottom of {{inningNumber}}st</h3></div>
      <div class="TexAlCenter"><h4>{{bottomInningPitcher}} pitching for {{topInningTeamName}}</h4></div>
      <p-treeTable [value]="bottomTeamEvents" selectionMode="single" (onNodeSelect)="nodeSelect($event)"
        class="ui-treetable-resizable ui-widget">
        <p-column styleClass="col-button" [style]="{'width':'60px'}">
          <ng-template let-car="rowData" pTemplate type="body">
            <button type="button" pButton (click)="showDetails(car)" icon="fa-search"></button>
          </ng-template>
        </p-column>
        <p-column field="description" header="Desciption"></p-column>
        <p-column field="p1stBase" header="Player 1st base" [style]="{'width':'120px', 'text-align':'center'}"></p-column>
        <p-column field="outs" header="Outs" [style]="{'width':'50px'}"></p-column>
        <p-column field="runs" header="Runs" [style]="{'width':'50px'}"></p-column>
        <p-column field="balls" header="Balls" [style]="{'width':'50px'}"></p-column>
        <p-column field="strikes" header="Strikes" [style]="{'width':'60px'}"></p-column>
        <p-column field="homeTeamScore" header="{{bottomInningTeamAbbr}}" [style]="{'width':'35px'}"></p-column>
        <p-column field="awayTeamScore" header="{{topInningTeamAbbr}}" [style]="{'width':'35px'}"></p-column>
      </p-treeTable>
    </div>
    <p-dialog [(visible)]="descriptionDisplay" modal="modal" showEffect="fade" *ngIf="descriptionVisible" [width]="1000" 
      header="Event Details">
      <sn-game-event-dialog-component
        [eventNum]="eventNum$"
        [eventId]="eventId$"
        [awayTeamScore]="awayTeamScore$"
        [balls]="balls$"
        [batter]="batter$"
        [description]="description$"        
        [eventType]="eventType$"
        [homeTeamScore]="homeTeamScore$"        
        [isTop]="isTop$"
        [outs]="outs$"
        [p1stBase]="p1stBase$"
        [p2stBase]="p2stBase$"
        [p3stBase]="p3stBase$"
        [pitcher]="pitcher$"
        [runs]="runs$"
        [strikes]="strikes$"
        [homeTeamName]="bottomInningTeamName"
        [homeTeamAbbr]="bottomInningTeamAbbr"
        [awayTeamName]="topInningTeamName"
        [awayTeamAbbr]="topInningTeamAbbr"
        [inningNumber]="inningNumber"
        [items]="items$">
      </sn-game-event-dialog-component>
    </p-dialog>
    <p-dialog [(visible)]="videoDisplay" modal="modal" showEffect="fade" [width]="620" header="{{videoDialogHeader}}" 
      (onBeforeHide)="hideVideoDialog($event)">
      <div id="player"></div>
      <div class="Container50">
        <button type="button" pButton (click)="seekVideo(30)" label="Start from 30 sec"></button>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameEventsComponent implements OnChanges {
  @Input() inningNumber;
  @Input() actionevents;
  @Input() atbatevents;
  @Input() gameplayers;
  @Output() inningCalling = new EventEmitter(false);

  awayTeamScore$;
  balls$;
  batter$;
  description$;
  eventNum$;
  eventType$;
  homeTeamScore$;
  eventId$;
  isTop$;
  outs$;
  p1stBase$;
  p2stBase$;
  p3stBase$;
  pitcher$;
  runs$;
  strikes$;
  items$;

  descriptionDisplay = false;
  descriptionVisible = false;
  videoDisplay = false;
  videoVisible = false;
  jwp;
  videoDialogHeader;
  inningCount: number[];
  loading = false;
  topTeamEvents: TreeNode[];
  bottomTeamEvents: TreeNode[];
  topInningPitcher: string;
  bottomInningPitcher: string;
  topInningTeamName: string;
  bottomInningTeamName: string;
  topInningTeamAbbr: string;
  bottomInningTeamAbbr: string;

  ngOnChanges(change) {
    if (change.atbatevents || change.actionevents || change.gameplayers) {
      if ((this.atbatevents.length > 0 || this.actionevents.length > 0) && this.gameplayers.length > 0) {
        this.buildEventInningSources(this.atbatevents, this.actionevents, this.gameplayers, this.inningNumber);
        this.loading = true;
      }
    }
  }

  seekVideo(timeSec) {
    this.jwp.seek(timeSec);
    this.jwp.play();
  }

  nodeSelect(eventData) {
    if (eventData.originalEvent.currentTarget.classList.contains('col-button')) {
      return false;
    }
    this.videoDialogHeader = eventData.node.data.description;
    this.videoVisible = true;
    this.videoDisplay = true;

    this.jwp = jwplayer('player').setup({
      controls: true,
      width: '600',
      height: '400',
      autostart: false,
      icons: true, // disable a big play button on the middle of screen
      plugins: {
        viral: {
          onpause: false,
          oncomplete: false,
          allowmenu: true
        }
      },
      file: 'https://www.youtube.com/watch?v=ZifL6aMjOnE',
      image: 'http://res.cloudinary.com/hd-numerique/image/upload/v1394886075/dossiers/photos/test-blu-ray-matrix-revolutions-8.jpg'
    });
  }

  showDetails(event) {
    this.awayTeamScore$ = event.data.awayTeamScore;
    this.balls$ = event.data.balls;
    this.batter$ = event.data.batter;
    this.description$ = event.data.description;
    this.eventNum$ = event.data.eventNum;
    this.eventType$ = event.data.eventType;
    this.homeTeamScore$ = event.data.homeTeamScore;
    this.eventId$ = event.data.id;
    this.isTop$ = event.data.isTop === true ? 'Top' : 'Bottom';
    this.outs$ = event.data.outs;
    this.p1stBase$ = event.data.p1stBase;
    this.p2stBase$ = event.data.p2stBase;
    this.p3stBase$ = event.data.p3stBase;
    this.pitcher$ = event.data.pitcher;
    this.runs$ = event.data.runs;
    this.strikes$ = event.data.strikes;
    this.items$ = event.children;

    this.descriptionVisible = true;
    this.descriptionDisplay = true;
  }

  hideVideoDialog(event) {
    this.jwp.stop();
  }

  inningClick(event) {
    this.inningNumber = parseInt(event.target.textContent, 0);
    this.inningCalling.emit(parseInt(event.target.textContent, 0));
  }

  buildEventInningSources(atbats, actions, gameplayers, inningNumber) {
    this.topTeamEvents = [];
    this.bottomTeamEvents = [];

    this.topInningTeamName = atbats[0].game.awayTeam.name;
    this.topInningTeamAbbr = atbats[0].game.awayTeam.abbr;
    this.bottomInningTeamName = atbats[0].game.homeTeam.name;
    this.bottomInningTeamAbbr = atbats[0].game.homeTeam.abbr;

    this.setInningCounts(atbats, actions);

    const curInEvTop = atbats.filter(e => e.inningNum === inningNumber && e.top === true);
    curInEvTop.sort((a, b): number => {
      if (a.num < b.num) {
        return -1;
      }
      if (a.num > b.num) {
        return 1;
      }
      return 0;
    });
    const curInEvBottom = atbats.filter(e => e.inningNum === inningNumber && e.top === false);
    curInEvBottom.sort((a, b): number => {
      if (a.num < b.num) {
        return -1;
      }
      if (a.num > b.num) {
        return 1;
      }
      return 0;
    });

    const curInActionTop = actions.filter(e => e.inningNum === inningNumber && e.top === true);
    curInActionTop.sort((a, b): number => {
      if (a.num < b.num) {
        return -1;
      }
      if (a.num > b.num) {
        return 1;
      }
      return 0;
    });
    const curInActionBottom = actions.filter(e => e.inningNum === inningNumber && e.top === false);
    curInActionBottom.sort((a, b): number => {
      if (a.num < b.num) {
        return -1;
      }
      if (a.num > b.num) {
        return 1;
      }
      return 0;
    });

    const topPitcher = gameplayers.filter(player => player.id === curInEvTop[0].pitcher.id);
    if (topPitcher.length > 0) {
      this.topInningPitcher = topPitcher[0].player.firstName + ' ' + topPitcher[0].player.lastName;
    }
    const bottomPitcher = gameplayers.filter(player => player.id === curInEvBottom[0].pitcher.id);
    if (bottomPitcher.length > 0) {
      this.bottomInningPitcher = bottomPitcher[0].player.firstName + ' ' + bottomPitcher[0].player.lastName;
    }

    for (const atbat of curInEvTop) {
      let player1stBase, player2stBase, player3stBase, batter, pitcher = '';
      if (atbat.on1B) {
        const gamePlayer1stBase = gameplayers.filter(player => player.id === atbat.on1B.id);
        if (gamePlayer1stBase.length > 0) {
          player1stBase = gamePlayer1stBase[0].player.lastName + '1st';
        }
      }
      if (atbat.on2B) {
        const gamePlayer2stBase = gameplayers.filter(player => player.id === atbat.on2B.id);
        if (gamePlayer2stBase.length > 0) {
          player2stBase = gamePlayer2stBase[0].player.lastName;
        }
      }
      if (atbat.on3B) {
        const gamePlayer3stBase = gameplayers.filter(player => player.id === atbat.on3B.id);
        if (gamePlayer3stBase.length > 0) {
          player3stBase = gamePlayer3stBase[0].player.lastName;
        }
      }
      if (atbat.batter) {
        const gamePlayerBatter = gameplayers.filter(player => player.id === atbat.batter.id);
        if (gamePlayerBatter.length > 0) {
          batter = gamePlayerBatter[0].player.lastName;
        }
      }
      if (atbat.pitcher) {
        const gamePlayerPitcher = gameplayers.filter(player => player.id === atbat.pitcher.id);
        if (gamePlayerPitcher.length > 0) {
          pitcher = gamePlayerPitcher[0].player.lastName;
        }
      }

      let runs, balls, strikes, outs = '';
      if (atbat.score === true) {
        runs = atbat.rbi + ' runs';
      }
      if (atbat.balls && atbat.balls !== '') {
        balls = atbat.balls + ' balls';
      }
      if (atbat.strikes && atbat.strikes !== '') {
        strikes = atbat.strikes + ' strikes';
      }
      if (atbat.outs && atbat.outs !== '') {
        outs = atbat.outs + ' outs';
      }

      const atbatEvent = {
        data: {
          id: atbat.id,
          p2stBase: player2stBase,
          p3stBase: player3stBase,
          batter: batter,
          pitcher: pitcher,
          eventNum: atbat.event,
          eventType: 'At Bat',
          isTop: atbat.top,
          description: atbat.description,
          p1stBase: player1stBase,
          outs: outs,
          runs: runs,
          balls: balls,
          strikes: strikes,
          awayTeamScore: atbat.awayTeamRuns,
          homeTeamScore: atbat.homeTeamRuns
        },
        children: []
      };

      for (const atbatItem of atbat.items) {
        let player1stBaseItem = '';
        if (atbatItem.on1B) {
          const gamePlayer1stBaseItem = gameplayers.filter(player => player.id === atbatItem.on1B.id);
          if (gamePlayer1stBaseItem.length) {
            player1stBaseItem = gamePlayer1stBaseItem[0].player.lastName + '1st';
          }
        }

        const item = {
          data: {
            id: 'id',
            p2stBase: '',
            p3stBase: '',
            batter: '',
            pitcher: '',
            eventNum: 0,
            eventType: '',
            isTop: atbatItem.top,
            description: atbatItem.description,
            p1stBase: player1stBaseItem,
            outs: '',
            runs: '',
            balls: '',
            strikes: '',
            awayTeamScore: atbatItem.awayTeamRuns,
            homeTeamScore: atbatItem.homeTeamRuns
          }
        };
        atbatEvent.children.push(item);
      }
      this.topTeamEvents.push(atbatEvent);
    }

    for (const action of curInActionTop) {
      let player1stBase, player2stBase, player3stBase, batter, pitcher = '';
      if (action.on1B) {
        const gamePlayer1stBase = gameplayers.filter(player => player.id === action.on1B.id);
        if (gamePlayer1stBase.length > 0) {
          player1stBase = gamePlayer1stBase[0].player.lastName + '1st';
        }
      }
      if (action.on2B) {
        const gamePlayer2stBase = gameplayers.filter(player => player.id === action.on2B.id);
        if (gamePlayer2stBase.length > 0) {
          player2stBase = gamePlayer2stBase[0].player.lastName;
        }
      }
      if (action.on3B) {
        const gamePlayer3stBase = gameplayers.filter(player => player.id === action.on3B.id);
        if (gamePlayer3stBase.length > 0) {
          player3stBase = gamePlayer3stBase[0].player.lastName;
        }
      }
      if (action.batter) {
        const gamePlayerBatter = gameplayers.filter(player => player.id === action.batter.id);
        if (gamePlayerBatter.length > 0) {
          batter = gamePlayerBatter[0].player.lastName;
        }
      }
      if (action.pitcher) {
        const gamePlayerPitcher = gameplayers.filter(player => player.id === action.pitcher.id);
        if (gamePlayerPitcher.length > 0) {
          pitcher = gamePlayerPitcher[0].player.lastName;
        }
      }

      let runs, balls, strikes, outs = '';
      if (action.score === true) {
        runs = action.rbi + ' runs';
      }
      if (action.balls && action.balls !== '') {
        balls = action.balls + ' balls';
      }
      if (action.strikes && action.strikes !== '') {
        strikes = action.strikes + ' strikes';
      }
      if (action.outs && action.outs !== '') {
        outs = action.outs + ' outs';
      }

      const actionEvent = {
        data: {
          id: action.id,
          p2stBase: player2stBase,
          p3stBase: player3stBase,
          batter: batter,
          pitcher: pitcher,
          eventNum: action.event,
          eventType: 'Action',
          isTop: action.top,
          description: action.description,
          p1stBase: player1stBase,
          outs: outs,
          runs: runs,
          balls: balls,
          strikes: strikes,
          awayTeamScore: action.awayTeamRuns,
          homeTeamScore: action.homeTeamRuns
        },
        children: []
      };
      this.topTeamEvents.push(actionEvent);
    }

    for (const atbat of curInEvBottom) {
      let player1stBase, player2stBase, player3stBase, batter, pitcher = '';
      if (atbat.on1B) {
        const gamePlayer1stBase = gameplayers.filter(player => player.id === atbat.on1B.id);
        if (gamePlayer1stBase.length > 0) {
          player1stBase = gamePlayer1stBase[0].player.lastName + '1st';
        }
      }
      if (atbat.on2B) {
        const gamePlayer2stBase = gameplayers.filter(player => player.id === atbat.on2B.id);
        if (gamePlayer2stBase.length > 0) {
          player2stBase = gamePlayer2stBase[0].player.lastName;
        }
      }
      if (atbat.on3B) {
        const gamePlayer3stBase = gameplayers.filter(player => player.id === atbat.on3B.id);
        if (gamePlayer3stBase.length > 0) {
          player3stBase = gamePlayer3stBase[0].player.lastName;
        }
      }
      if (atbat.batter) {
        const gamePlayerBatter = gameplayers.filter(player => player.id === atbat.batter.id);
        if (gamePlayerBatter.length > 0) {
          batter = gamePlayerBatter[0].player.lastName;
        }
      }
      if (atbat.pitcher) {
        const gamePlayerPitcher = gameplayers.filter(player => player.id === atbat.pitcher.id);
        if (gamePlayerPitcher.length > 0) {
          pitcher = gamePlayerPitcher[0].player.lastName;
        }
      }

      let runs, balls, strikes, outs = '';
      if (atbat.score === true) {
        runs = atbat.rbi + ' runs';
      }
      if (atbat.balls && atbat.balls !== '') {
        balls = atbat.balls + ' balls';
      }
      if (atbat.strikes && atbat.strikes !== '') {
        strikes = atbat.strikes + ' strikes';
      }
      if (atbat.outs && atbat.outs !== '') {
        outs = atbat.outs + ' outs';
      }

      const atbatEvent = {
        data: {
          id: atbat.id,
          p2stBase: player2stBase,
          p3stBase: player3stBase,
          batter: batter,
          pitcher: pitcher,
          eventNum: atbat.event,
          eventType: 'At Bat',
          isTop: atbat.top,
          description: atbat.description,
          p1stBase: player1stBase,
          outs: outs,
          runs: runs,
          balls: balls,
          strikes: strikes,
          awayTeamScore: atbat.awayTeamRuns,
          homeTeamScore: atbat.homeTeamRuns
        },
        children: []
      };
      for (const atbatItem of atbat.items) {
        let player1stBaseItem = '';
        if (atbatItem.on1B) {
          const gamePlayer1stBaseItem = gameplayers.filter(player => player.id === atbatItem.on1B.id);
          if (gamePlayer1stBaseItem.length) {
            player1stBaseItem = gamePlayer1stBaseItem[0].player.lastName + '1st';
          }
        }

        const item = {
          data: {
            id: 'id',
            p2stBase: '',
            p3stBase: '',
            batter: '',
            pitcher: '',
            eventNum: 0,
            eventType: '',
            isTop: atbatItem.top,
            description: atbatItem.description,
            p1stBase: player1stBaseItem,
            outs: '',
            runs: '',
            balls: '',
            strikes: '',
            awayTeamScore: atbatItem.awayTeamRuns,
            homeTeamScore: atbatItem.homeTeamRuns
          }
        };
        atbatEvent.children.push(item);
      }
      this.bottomTeamEvents.push(atbatEvent);
    }

    for (const action of curInActionBottom) {
      let player1stBase, player2stBase, player3stBase, batter, pitcher = '';
      if (action.on1B) {
        const gamePlayer1stBase = gameplayers.filter(player => player.id === action.on1B.id);
        if (gamePlayer1stBase.length > 0) {
          player1stBase = gamePlayer1stBase[0].player.lastName + '1st';
        }
      }
      if (action.on2B) {
        const gamePlayer2stBase = gameplayers.filter(player => player.id === action.on2B.id);
        if (gamePlayer2stBase.length > 0) {
          player2stBase = gamePlayer2stBase[0].player.lastName;
        }
      }
      if (action.on3B) {
        const gamePlayer3stBase = gameplayers.filter(player => player.id === action.on3B.id);
        if (gamePlayer3stBase.length > 0) {
          player3stBase = gamePlayer3stBase[0].player.lastName;
        }
      }
      if (action.batter) {
        const gamePlayerBatter = gameplayers.filter(player => player.id === action.batter.id);
        if (gamePlayerBatter.length > 0) {
          batter = gamePlayerBatter[0].player.lastName;
        }
      }
      if (action.pitcher) {
        const gamePlayerPitcher = gameplayers.filter(player => player.id === action.pitcher.id);
        if (gamePlayerPitcher.length > 0) {
          pitcher = gamePlayerPitcher[0].player.lastName;
        }
      }

      let runs, balls, strikes, outs = '';
      if (action.score === true) {
        runs = action.rbi + ' runs';
      }
      if (action.balls && action.balls !== '') {
        balls = action.balls + ' balls';
      }
      if (action.strikes && action.strikes !== '') {
        strikes = action.strikes + ' strikes';
      }
      if (action.outs && action.outs !== '') {
        outs = action.outs + ' outs';
      }

      const actionEvent = {
        data: {
          id: action.id,
          p2stBase: player2stBase,
          p3stBase: player3stBase,
          batter: batter,
          pitcher: pitcher,
          eventNum: action.event,
          eventType: 'Action',
          isTop: action.top,
          description: action.description,
          p1stBase: player1stBase,
          outs: outs,
          runs: runs,
          balls: balls,
          strikes: strikes,
          awayTeamScore: action.awayTeamRuns,
          homeTeamScore: action.homeTeamRuns
        },
        children: []
      };
      this.bottomTeamEvents.push(actionEvent);
    }
  };

  setInningCounts(atbats, actions) {
    if (typeof this.inningCount === 'undefined') {
      this.inningCount = [];
    }
    let newInningCount = [];
    for (const i in atbats) {
      if (newInningCount.indexOf(atbats[i].inningNum) === -1) {
        newInningCount.push(atbats[i].inningNum);
      }
    }
    for (const i in actions) {
      if (newInningCount.indexOf(actions[i].inningNum) === -1) {
        newInningCount.push(actions[i].inningNum);
      }
    }
    newInningCount = newInningCount.sort((n1, n2) => n1 - n2);

    if (newInningCount.length > 1) {
      this.inningCount = newInningCount;
    }
  }
}
