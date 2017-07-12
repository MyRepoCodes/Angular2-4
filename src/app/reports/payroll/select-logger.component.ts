import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PayrollService } from './payroll.service';

@Component({
  selector: 'sn-select-logger',
  template: `
<p-multiSelect 
  [options]="loggers" 
  [(ngModel)]="selectedLoggers"
  (onChange)="loggerChanged.emit($event.value)"
  [style]="{'width':'100%'}" 
  [disabled]="loading"
></p-multiSelect>
`
})
export class SelectLoggerComponent implements OnInit, OnDestroy {
  @Input()
  set payrollPeriod(payrollPeriodNumber: string) {
    this._payrollPeriod = payrollPeriodNumber;
    this.loadByPayrollPeriodNumber(payrollPeriodNumber);
  }

  get payrollPeriod(): string {
    return this._payrollPeriod;
  }

  @Input() selectedLoggers;
  @Output() loggerChanged = new EventEmitter(false);

  loggers;
  loading = true;

  private _payrollPeriod;
  private emptyLoggers = [{ label: 'Select Logger', value: '' }];
  private sub;

  constructor(private payrollService: PayrollService) {
    this.loggers = this.emptyLoggers;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadByPayrollPeriodNumber(payrollPeriodNumber) {
    this.loading = true;

    if (payrollPeriodNumber) {
      this.sub = this.payrollService.loadLoggersByPayrollPeriodNumber(payrollPeriodNumber)
        .map( loggers => loggers.filter( x => x && x.last))
        .subscribe(loggers => {
          const loggerList = loggers.map(s => ({ label: `${s.first} ${s.last}`, value: s.id }));
          this.loggers = this.emptyLoggers.concat(loggerList);

          if (!this.isLoggerInCollection(loggers)) {
            this.selectedLoggers = [];
            this.loggerChanged.emit([]);
          }

          this.loading = false;
        });
    } else {
      this.loggers = this.emptyLoggers;
      this.selectedLoggers = [];
      this.loggerChanged.emit(this.selectedLoggers);
      this.loading = true;
    }
  }

  private isLoggerInCollection(loggers) {
    // todo: search in array, selectedLoggers is comma separated loggers
    return loggers.map(x => x.id).indexOf(this.selectedLoggers) !== -1;
  }
}
