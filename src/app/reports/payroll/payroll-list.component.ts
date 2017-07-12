import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'sn-payroll-list',
  templateUrl: 'payroll-list.component.html',
  styles: [`
    .noExpander span.ui-row-toggler {
      display: none;
    }
    .ui-datatable .ui-datatable-data>tr>td {
      overflow: visible;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class PayrollListComponent {

  @Input() set payrolls(data) {
    this._payrolls = data;
    let i = 0;
    this._payrolls.forEach(x => x.rowIndex = i++);
  };

  @Output() createPayroll = new EventEmitter();
  @Output() saveAdjustment = new EventEmitter();

  @ViewChildren('typeDropdown') dropdowns: QueryList<any>;

  adjustmentTypes = [
    { label: 'None', value: 0 },
    { label: 'Incomplete Game', value: 1 },
    { label: 'Tech Issues', value: 2 },
    { label: 'Live Game Pay', value: 3 }
  ];

  _payrolls;

  expandedRows = [];

  onCreateButtonClick() {
    this.createPayroll.emit(true);
  }

  expandAll() {
    this.expandedRows = this._payrolls
      .filter(x => x.relatedRecords.length > 0);
  }

  shrinkAll() {
    this.expandedRows = [];
  }

  rowStyle(rowData) {
    return (rowData.relatedRecords && rowData.relatedRecords.length > 0) ? '' : 'noExpander';
  }

  saveAdjustmentForRecord(record) {
    this.saveAdjustment.emit({
      adjustment: record.adjustment,
      adjustmentType: record.adjustmentType,
      id: record.id
    });
  }

  onAdjustmentBlur(e, i) {
    const val = e.target.value;
    const record = this._payrolls[i];
    if (val !== record.adjustment.toString()) {
      record.adjustment = val;
      this.saveAdjustmentForRecord(record);
    }
  }

  onAdjustmentTypeBlur(e, i) {
    const val = e.target.value;
    const record = this._payrolls[i];
    if (val !== record.adjustmentType.toString()) {
      record.adjustmentType = val;
      this.saveAdjustmentForRecord(record);
    }
  }

  onAdjustmentFocus(e) {
    e.target.select();
  }

  editInit(e) {
    if (e.column.field === 'adjustmentType') {
      const rowIndex = e.data.rowIndex;
      const el = this.dropdowns.find((_, i) => i === rowIndex).nativeElement;
      setTimeout(() => {
        el.focus();
        if (parseInt(el.value, 10) === 0) { // preselect 'Incomplete Game' if 'None' is selected
          el.value = 1;
        }
      });
    }
  }

}
