import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';
import { Payroll } from './payroll.model';
import * as moment from 'moment';

@Component({
  selector: 'sn-payroll-row-expansion',
  templateUrl: 'payroll-row-expansion.component.html',
  styles: [
    `
      .current {
        color: #0f9e60;
      }
      .expansionContainer {
        border-left: solid 10px moccasin;
        padding-left: 5px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class PayrollRowExpansionComponent {

  @Input() set payrollRecord(record) {
    this._record = record;
    if (record.relatedRecords.length > 0) {
      this._relatedRecords = [...record.relatedRecords, record];
    }
  }

  _record;
  _relatedRecords;

  getStyleClass = (rowData) => rowData.id === this._record.id ? 'current' : '';
}
