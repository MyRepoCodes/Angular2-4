import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sn-game-event-dialog-component',
  template: `
    <div class="ui-g">
      <div class="ui-g-10 ui-g-nopad">
        <div class="ui-g-2">{{eventNum}}</div>
        <div class="ui-g-2">{{eventType}}</div>
        <div class="ui-g-8">{{eventId}}</div>
        <div class="ui-g-10">{{description}}</div>
        <div class="ui-g-2">{{isTop}} of {{inningNumber}}st</div>                
      </div>
      <div class="ui-g-2 ui-g-nopad">
        <div class="ui-g-6">{{awayTeamAbbr}}</div>
        <div class="ui-g-6">{{homeTeamAbbr}}</div>
        <div class="ui-g-6">{{awayTeamScore}}</div>
        <div class="ui-g-6">{{homeTeamScore}}</div>
      </div>
    </div>
    <div class="ui-g">
      <div class="ui-g-12"></div>
    </div>
    <div class="ui-g">
      <div class="ui-g-2 ui-g-nopad">
        <div class="ui-g-12">1st base:</div>
        <div class="ui-g-12">2st base:</div>
        <div class="ui-g-12">3st base:</div>
        <div class="ui-g-12">Batter:</div>
        <div class="ui-g-12">Pitcher:</div>
      </div>
    
      <div class="ui-g-2 ui-g-nopad">        
        <div class="ui-g-12">{{p1stBase}}</div>
        <div class="ui-g-12">{{p2stBase}}</div>
        <div class="ui-g-12">{{p3stBase}}</div>        
        <div class="ui-g-12">{{batter}}</div>        
        <div class="ui-g-12">{{pitcher}}</div>
      </div>
                  
      <div class="ui-g-2 ui-g-nopad">
        <div class="ui-g-12">Balls:</div>
        <div class="ui-g-12">Outs:</div>
        <div class="ui-g-12">Strikes:</div>
        <div class="ui-g-12">rbi:</div>
        <div class="ui-g-12"></div>
      </div>
    
      <div class="ui-g-2 ui-g-nopad">        
        <div class="ui-g-12">{{balls}}</div>                
        <div class="ui-g-12">{{outs}}</div>                
        <div class="ui-g-12">{{strikes}}</div>               
        <div class="ui-g-12">{{rbi}}</div>        
        <div class="ui-g-12"></div>
      </div>
      <div class="1 ui-g-nopad">        
          <div class="ui-g-12">Items:</div>                  
      </div>
      <div class="3 ui-g-nopad">
        <div *ngFor="let item of items">                      
          <div class="ui-g-12">{{item.data.description}}</div>
        </div>        
      </div>      
    </div>    
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameEventDialogComponent {
  @Input() eventNum;
  @Input() eventId;
  @Input() awayTeamScore;
  @Input() balls;
  @Input() batter;
  @Input() description;
  @Input() eventType;
  @Input() homeTeamScore;
  @Input() isTop;
  @Input() outs;
  @Input() p1stBase;
  @Input() p2stBase;
  @Input() p3stBase;
  @Input() pitcher;
  @Input() runs;
  @Input() strikes;
  @Input() awayTeamName;
  @Input() awayTeamAbbr;
  @Input() homeTeamName;
  @Input() homeTeamAbbr;
  @Input() inningNumber;
  @Input() items;
  rbi;
}
