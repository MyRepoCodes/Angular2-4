import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sn-prop-search',
  template: `
    
    <div class="ui-g">
      <div class="ui-g-10">
        <div style="display: inline-block" *ngFor="let d of definitions">
          {{d.label}} 
          <input *ngIf="!d.type" type="text" pInputText [(ngModel)]="d.value"/>
          <p-calendar *ngIf="d.type === 'date'" [(ngModel)]="d.value"></p-calendar>
          <p-calendar *ngIf="d.type === 'datetime'" [showTime]="true" [(ngModel)]="d.value"></p-calendar>
        </div>
      </div>
      <div class="ui-g-2">
        <button pButton label="Search" (click)="onSearchClick()"></button>
      </div>
    </div>


  `,
  styles: [`:host {width: 100%}`]
})
export class PropertySearchComponent implements OnInit {

  @Input() definitions;

  @Output() search = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSearchClick() {
    this.search.emit(
      this.definitions
        .filter(d => d.value)
        .map(d => ({ field: d.field, value: d.value, op: d.op, type: d.type }))
    );
  }

}
