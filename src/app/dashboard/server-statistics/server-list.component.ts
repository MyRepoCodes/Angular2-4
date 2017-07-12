import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-server-list',
  template: `
<div class="ui-g">
  
  <div class="ui-g-12 ui-fluid">
    <div class="ui-g-4">
      <p-dropdown [options]="leagues" [ngModel]="leagueId" (onChange)="onLeagueSelect($event.value)" [autoWidth]="false">
      </p-dropdown>
    </div>
  </div>
  
  <p-treeTable [value]="encodersData" selectionMode="single" (onNodeExpand)="nodeExpand($event)">
    <p-column field="ServerName" header="" [style]="{'width':'120px'}"></p-column>
    <p-column field="TvEncoding" header="TV"></p-column>
    <p-column field="GamesUploading" header="Uploading"></p-column>
    <p-column field="UploadComplete" header="Complete"></p-column>
    <p-column field="ReadyToEncode" header="Encode"></p-column>
    <p-column field="Encoding" header="Encoding"></p-column>
    <p-column field="ReadyToP0Qa" header="P0 QA"></p-column>
    <p-column field="ReadyToP1" header="Ready P1"></p-column>
    <p-column field="P1InProgress" header="P1 Progress"></p-column>
    <p-column field="NeedsPbp" header="Needs PBP"></p-column>
    <p-column field="ReadyToP2" header="Ready P2"></p-column>
    <p-column field="P2InProgress" header="P2 Progress"></p-column>
    <p-column field="Triggers" header="Triggers"></p-column>
  </p-treeTable>
  
  <div class="ui-g-12">
    <div class="ui-g-11"></div>
    <div class="ui-g-1">
      <button pButton (click)="onRefresh()" type="submit" label="Refresh"></button>
    </div>
  </div>
    
</div>
`
})
export class ServerListComponent {
  @Input() encodersData;
  @Input() loaded;
  @Input() leagueId;
  @Input() leagues;
  @Output() refresh = new EventEmitter(false);
  @Output() selectedLeague = new EventEmitter(false);
  @Output() loadServers = new EventEmitter(false);
  @Output() loadGames = new EventEmitter(false);

  onRefresh = () => {
    this.refresh.emit(true);
  }

  onLeagueSelect = (leagueId) => {
    this.selectedLeague.emit(leagueId);
  }

  nodeExpand(event) {
    if (event.node.data.type === 'dataCenter' && event.node.children.length === 0) {
      this.loadServers.emit(event.node);
    } else if (event.node.data.type === 'server' && event.node.children.length === 0) {
      this.loadGames.emit(event.node);
    }
  }
}
