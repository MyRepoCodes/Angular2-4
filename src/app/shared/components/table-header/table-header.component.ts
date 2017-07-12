import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sn-table-header',
    template: `
    <p-toggleButton 
      onLabel="IDs" offLabel="IDs" Class="GameFilter"
      onIcon="fa-check-square" offIcon="fa-square"
      [(ngModel)]="showIdsColumn"
      [style]="{'float':'left'}"
    ></p-toggleButton>
      
    <ng-content></ng-content>
    
    <button pButton type="text" (click)="add.emit($event)" icon="fa-plus-circle" 
      class="ui-button-success" style="float:right"></button>
      
    <div class="ui-helper-clearfix"></div>
`
})
export class TableHeaderComponent {
  @Input() name: string;
  @Output() add = new EventEmitter(false);

  public showIdsColumn = false;
  public showNameColumn = false;

  public isIdsVisible(): boolean {
    return this.showIdsColumn;
  }
}
