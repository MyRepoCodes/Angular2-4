import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'sn-team-rule',
    templateUrl: 'team-rule.component.html',
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
export class TeamRuleComponent {
  @Input() set formGroupRef(formGroup: FormGroup) {
    formGroup.addControl('shortName', new FormControl());
    formGroup.addControl('fullName', new FormControl());

    this.form = formGroup;
  }

  @Input() set data(rule) {
    if (rule) {
      this.form.patchValue(rule);
    }
  }

  @Input() teamsOptions;

  @Input() isResolution = false;

  form: FormGroup;

  onTeamSelected(teamName) {
    this.form.patchValue({fullName: teamName});
  }

  constructor() {

  }


}
