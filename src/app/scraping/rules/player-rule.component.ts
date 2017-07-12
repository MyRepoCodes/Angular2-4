import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'sn-player-rule',
  templateUrl: 'player-rule.component.html',
  styles: [
    `
      .included {
        color: green;
        font-weight: bold;
        text-decoration: underline;
      }
      
    `
  ]
})
export class PlayerRuleComponent implements OnInit {

  @Input() set formGroupRef(formGroup: FormGroup) {
    formGroup.addControl('firstname', new FormControl());
    formGroup.addControl('lastname', new FormControl());
    formGroup.addControl('birthDate', new FormControl());
    formGroup.addControl('heightInches', new FormControl());
    formGroup.addControl('weightPounds', new FormControl());
    formGroup.addControl('battingArm', new FormControl());
    formGroup.addControl('throwingArm', new FormControl());
    formGroup.addControl('iidHint', new FormControl());

    this.form = formGroup;
  }

  @Input() set data(rule) {
    if (rule) {
      this.form.patchValue(rule);
    }
  }

  @Input() isResolution = false;

  form: FormGroup;

  armOptions: SelectItem[] = [
    { label: 'Choose', value: '' },
    { label: 'Right', value: '0' },
    { label: 'Left', value: '1' },
    { label: 'Switch', value: '2' }
  ];

  constructor() {

  }

  ngOnInit() {
  }

}
