import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sn-select-baseball-lineup',
    template: `
<p-dropdown [style]="{'width': '75%'}" 
  [options]="options" 
  [ngModel]="lineup"
  (onChange)="lineupSelected($event.value)"
></p-dropdown>
`
})
export class SelectBaseballLineupComponent {
  @Input() lineup;
  @Output() lineupChanged = new EventEmitter(false);

  options;

  private availableOptions = [
    { label: 'Starting', value: 0 },
    { label: 'Bench', value: 1 },
    { label: 'Bullpen', value: 2 },
  ];

  constructor() {
    this.options = this.availableOptions;
  }

  lineupSelected(lineupValue) {
    this.lineup = lineupValue;
    this.lineupChanged.emit(lineupValue);
  }
}
