import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TIMEZONES, TimeZone } from './timezones';

@Component({
  selector: 'sn-select-timezone',
  templateUrl: './select-timezone.component.html',
  styleUrls: ['./select-timezone.component.css']
})
export class SelectTimezoneComponent {

  @Input() set timezone(tzValue: string) {
    const tz = this.getTZ(tzValue);
    this._timezone = tz.windowsTimeZone;
  }
  get timezone(): string {
    return this._timezone || 'UTC';
  }

  @Output() timezoneChanged = new EventEmitter<TimeZone>(false);

  timezoneItems: any[];

  private _timezone: string;

  constructor() {
    this.timezoneItems = TIMEZONES.map(tz => ({ label: tz.text, value: tz.windowsTimeZone}));
  }

  timezoneSelected(tzValue: string) {
    this.timezone = tzValue;
    this.timezoneChanged.emit(this.getTZ(tzValue));
  }

  private getTZ(tzValue: string) {
    return TIMEZONES.filter(t => t.windowsTimeZone === tzValue)[0] || TIMEZONES.filter(t => t.windowsTimeZone === 'UTC')[0];
  }

}

