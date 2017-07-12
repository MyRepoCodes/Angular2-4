import { Component, Input } from '@angular/core';

@Component({
  selector: 'sn-conflict-resolution',
  templateUrl: 'conflict-resolution.component.html'
})
export class ConflictResolutionComponent {

  @Input() conflict;
  @Input() loading;
  @Input() entityType;

  @Input() set resolutionData(resolution) {
    if (resolution) {
      this.resolution = resolution;
      this.suggestions = resolution.candidates.map(c => c.object);
    }
  };

  resolution;
  suggestions;

  ruleCreated = false;

  constructor() {
  }

  onRuleCreated() {
    this.ruleCreated = true;
  }

}
