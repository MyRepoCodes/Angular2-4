import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ApiService } from '../../shared/api';
import { Observable } from 'rxjs/Observable';
import { API_PAYROLL_PERIODS_URL } from '../../shared/api';

@Component({
  selector: 'sn-payroll-period',
  template: `
<p-dropdown 
  [options]="periodOptions" 
  [ngModel]="payrollPeriod"
  (onChange)="payrollPeriodSelected($event.value)"
  [style]="{'width':'100%'}" 
  [autoWidth]="true"
></p-dropdown>
`
})
export class PayrolPeriodComponent {

  @Input() set periods(periods) {
    this.periodOptions = periods
      .map(x => ({ label: x.id, value: x.id }));
    this.periodOptions.unshift({ label: 'Select Payroll', value: '' });
  };

  @Input() payrollPeriod;
  @Output() payrollPeriodChanged = new EventEmitter(false);

  periodOptions;
  loading = true;

  payrollPeriodSelected(payrollPeriod) {
    this.payrollPeriod = payrollPeriod;
    this.payrollPeriodChanged.emit(payrollPeriod);
  }
}

