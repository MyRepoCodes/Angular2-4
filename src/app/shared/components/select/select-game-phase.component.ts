import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-select-game-phase',
  template: `
<p-dropdown 
  [options]="phases" 
  [ngModel]="phase"
  (onChange)="phaseChanged.emit($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
></p-dropdown>
`
})
export class GamePhaseComponent implements OnInit {
  @Input() phase;
  @Output() phaseChanged = new EventEmitter(false);

  phases;

  constructor() { }

  ngOnInit() {
    this.phases = [
      { label: `Select Phase`, value: '' },
      { label: `Phase 1`, value: '1' },
      { label: `Phase 2`, value: '2' },
      { label: `Phase 3`, value: '3' }
    ];
  }
}

