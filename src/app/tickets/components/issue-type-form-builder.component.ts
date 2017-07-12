import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IssueType } from '../ticketing.models';

@Component({
  selector: 'sn-issue-type-form-builder',
  templateUrl: 'issue-type-form-builder.component.html'
})
export class IssueTypeFormBuilderComponent {

  @Input() issueType;

  @Output() issueTypeUpdated = new EventEmitter();

  selectedIssueControl;
  addingControl = false;

  constructor() {
    this.issueType = new IssueType();
  }

  addControl() {
    this.selectedIssueControl = undefined;
    this.addingControl = true;
  }

  save() {
    this.issueTypeUpdated.emit(this.issueType);
  }

  onIssueControlSubmit(submitted) {

    if (this.issueType.controls.length === 0) {
      submitted.order = 0;
    } else {
      const order = this.issueType.controls[this.issueType.controls.length - 1].order;
      submitted.order = order + 1;
    }

    this.issueType.controls.push(submitted);
    this.addingControl = false;
  }

  onIssueControlEdit(submitted) {
    const index = this.issueType.controls.findIndex(x => x.order === submitted.order);
    this.issueType.controls[index] = submitted;
    this.addingControl = false;
  }

  onCancel() {
    this.addingControl = false;
  }

  editControl(issueControl) {
    this.selectedIssueControl = issueControl;
    this.addingControl = true;
  }

  moveUp(data) {
    const controls = this.issueType.controls;
    const index = controls.indexOf(data);
    if (index - 1 >= 0) {
      const tmp = controls[index - 1];
      controls[index - 1] = data;
      controls[index] = tmp;
    }
  }

  moveDown(data) {
    const controls = this.issueType.controls;
    const index = controls.indexOf(data);
    if (index + 1 < controls.length) {
      const tmp = controls[index + 1];
      controls[index + 1] = data;
      controls[index] = tmp;
    }
  }

  remove(data) {
    this.issueType.controls = this.issueType.controls.filter( x => x.order !== data.order);
  }

}

