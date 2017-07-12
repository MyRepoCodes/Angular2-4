import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { IssueControl } from '../ticketing.models';

@Component({
  selector: 'sn-add-issue-control',
  templateUrl: 'add-issue-control.component.html'
})
export class AddIssueControlComponent implements OnInit {

  editMode = false;

  @Input() set prefill(model: IssueControl) {
    if (model) {
      this.model = model;
      this.editMode = true;
    }
  }

  @Output() submit = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  controlTypes: SelectItem[];
  model;

  constructor() {
    this.model = new IssueControl();
  }

  ngOnInit() {
    this.controlTypes = [];
    this.controlTypes.push({ label: 'Checkbox', value: 'checkbox' });
    this.controlTypes.push({ label: 'Dropdown', value: 'dropdown' });
    this.controlTypes.push({ label: 'Text Input', value: 'inputText' });
    this.controlTypes.push({ label: 'Timepicker', value: 'timepicker' });

    if (!this.model.type) {
      this.model.type = 'checkbox';
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.edit.emit(this.model);
    } else {
      this.submit.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit(true);
  }
}
