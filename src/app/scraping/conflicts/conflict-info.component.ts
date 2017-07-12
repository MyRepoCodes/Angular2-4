import { Component, Input } from '@angular/core';

@Component({
  selector: 'sn-conflict-info',
  template: `   
    <div *ngIf="entityType === 'Player'">
      <div class="ui-g-2 label">First Name:</div>
      <div class="ui-g-4">{{data.firstname}}</div>
      
      <div class="ui-g-2 label">Birth Date:</div>
      <div class="ui-g-4">{{data.birthDate ? data.birthDate : '-'}}</div>
    
      <div class="ui-g-2 label">Last Name:</div>
      <div class="ui-g-4">{{data.lastname}}</div>
        
      <div class="ui-g-2 label">Height:</div>
      <div class="ui-g-4">{{data.heightInches}}</div>
    
      <div class="ui-g-2 label">Batting Arm:</div>
      <div class="ui-g-4">{{data.battingArm}}</div>
    
      <div class="ui-g-2 label">Weight:</div>
      <div class="ui-g-4">{{data.weightPounds}}</div>
    
      <div class="ui-g-2 label">Throwing Arm:</div>
      <div class="ui-g-4">{{data.throwingArm}}</div>
    
      <div class="ui-g-2 label">Current Team:</div>
      <div class="ui-g-4">{{data.currentTeam}}</div>
    </div>
    
    <div *ngIf="entityType === 'Game'">
      <div class="ui-g-2 label">Away Team:</div>
      <div class="ui-g-4">{{data.gameTeams.awayTeam}}</div>
      
      <div class="ui-g-2 label">Home Team:</div>
      <div class="ui-g-4">{{data.gameTeams.homeTeam}}</div>
      
      <div class="ui-g-2 label">Away Team Score:</div>
      <div class="ui-g-4"> 
        <div *ngIf="!data.score">-</div>
        <div *ngIf="data.score">
          {{data.score.awayTeamRuns}} | {{data.score.awayTeamHits}} | {{data.score.awayTeamErrors}}
        </div>  
      </div>
      
      <div class="ui-g-2 label">Home Team Score:</div>
      <div class="ui-g-4"> 
        <div *ngIf="!data.score">-</div>
        <div *ngIf="data.score">
          {{data.score.homeTeamRuns}} | {{data.score.homeTeamHits}} | {{data.score.homeTeamErrors}}
        </div>  
      </div>
      
      <div class="ui-g-2 label">Game Year:</div>
      <div class="ui-g-4">{{data.gameTime.gameYear}}</div>
    
      <div class="ui-g-2 label">Game Hour:</div>
      <div class="ui-g-4">{{data.gameTime.gameHour}}</div>
      
      <div class="ui-g-2 label">Game Month:</div>
      <div class="ui-g-4">{{data.gameTime.gameMonth}}</div>
      
      <div class="ui-g-2 label">Game Minute:</div>
      <div class="ui-g-4">{{data.gameTime.gameMinute ? data.gameTime.gameMinute : '0'}}</div>
    
      <div class="ui-g-2 label">Game Day:</div>
      <div class="ui-g-4">{{data.gameTime.gameDay}}</div>
      
      <div class="ui-g-2 label">Game UTC:</div>
      <div class="ui-g-4">{{data.gameTime.utcDate}}</div>
    </div>
    
    <div *ngIf="entityType === 'GameLineup'">
    
      <div class="ui-g-2 label">Away Team:</div>
      <div class="ui-g-4">{{data.game.gameTeams.awayTeam}}</div>
      
      <div class="ui-g-2 label">Home Team:</div>
      <div class="ui-g-4">{{data.game.gameTeams.homeTeam}}</div>
      
      <div class="ui-g-2 label">Away Team Score:</div>
      <div class="ui-g-4"> 
        <div *ngIf="!data.game.score">-</div>
        <div *ngIf="data.game.score">
           {{data.game.score.awayTeamRuns}} | {{data.game.score.awayTeamHits}} | {{data.game.score.awayTeamErrors}}
        </div>  
      </div>
      
      <div class="ui-g-2 label">Home Team Score:</div>
      <div class="ui-g-4"> 
        <div *ngIf="!data.game.score">-</div>
        <div *ngIf="data.game.score">
           {{data.game.score.homeTeamRuns}} | {{data.game.score.homeTeamHits}} | {{data.game.score.homeTeamErrors}}
        </div>  
      </div>
    
      <div class="ui-g-2 label">Game Date:</div>
      <div class="ui-g-4">{{data.game.gameTime.gameDateStr}}</div>
  
      <div class="ui-g-2 label">Game Date UTC:</div>
      <div class="ui-g-4">{{data.game.gameTime.utcDate}}</div>
  
      <div class="ui-g-2 label">First Name:</div>
      <div class="ui-g-4">{{data.player.firstname}}</div>
      
      <div class="ui-g-2 label">Birth Date:</div>
      <div class="ui-g-4">{{data.player.birthDate}}</div>
  
      <div class="ui-g-2 label">Last Name:</div>
      <div class="ui-g-4">{{data.player.lastname}}</div>
    
      <div class="ui-g-2 label">Position:</div>
      <div class="ui-g-4">{{data.player.position}}</div>
  
      <div class="ui-g-2 label">Number:</div>
      <div class="ui-g-4">{{data.player.number}}</div>
  
      <div class="ui-g-2 label">Bat Order:</div>
      <div class="ui-g-4">{{data.batOrder}}</div>
      
      <div class="ui-g-2 label">Player Team:</div>
      <div class="ui-g-4">{{data.playerTeam == 'Home' ? data.game.gameTeams.homeTeam : data.game.gameTeams.awayTeam}}</div>
    
      <div class="ui-g-2 label">Starting Position:</div>
      <div class="ui-g-4">{{data.lineupType ? data.lineupType : "Starting"}}</div>
      
      
    </div>
     
  `,
  styles: [`:host { width: 100%}`]
})
export class ConflictInfoComponent {

  @Input() entityType: string;
  @Input() data;

  constructor() {
  }
}
