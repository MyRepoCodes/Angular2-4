import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-select-bats-throws',
    template: `
<p-dropdown [style]="{'width': '75%'}" 
  [options]="options" 
  [ngModel]="playingLineup"
  (onChange)="batsThrowSelected($event.value)"
></p-dropdown>
`
})
export class SelectbatsThrowsComponent {
  @Input() playingLineup;
  @Output() playingLineupChanged = new EventEmitter(false);

  options;

  private availableOptions = [
    { label: 'Select lineup' },
    { label: 'Right', value: 0 },
    { label: 'Left', value: 1 },
    { label: 'Switch', value: 2 },
  ];

  constructor() {
    this.options = this.availableOptions;
  }

  batsThrowSelected(lineupValue) {
    this.playingLineup = lineupValue;
    this.playingLineupChanged.emit(lineupValue);
  }
}
