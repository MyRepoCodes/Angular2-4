import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-generate-payrolls',
  template: `
      <div class="ui-g">
        <div class="ui-g-3">Year:</div>
        <div class="ui-g-9">
          <p-spinner [(ngModel)]="year" [min]="2016" [max]="2017" [formatInput]="false"></p-spinner>
        </div>
      </div>
      <div class="ui-g">
        <div class="ui-g-3">Period:</div>
        <div class="ui-g-9">
          <p-spinner [(ngModel)]="period" [min]="1" [max]="24"></p-spinner>
        </div>
      </div>
      <br/>
      <button pButton label="Generate" (click)="onClick()"></button>
    `
})
export class GeneratePayrollsComponent {

  @Output() generateRequested = new EventEmitter();

  year = 2017;
  period = 1;

  onClick() {
    this.generateRequested.emit(`${this.year}.${this.period}`);
  }
}
