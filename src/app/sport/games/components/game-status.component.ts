import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../job.entity';

@Component({
    selector: 'sn-game-status',
    template: `
<div *ngIf="game">
  <div class="ui-g-12" *ngIf="!!(game.jobs)">
    <div class="ui-g-2"><b>Game Jobs</b></div>
    <div class="ui-g-2"><b>Job Status</b></div>
    <div class="ui-g-2"><b>Job Assignee</b></div>
  </div>
  <div class="ui-g-12 ui-g-nopad" *ngFor="let job of game.jobs">  
    <span class="ui-g-2 ui-g-nopad">
      {{getJobNameByJobType(job.jobType)}}
    </span>
    <span class="ui-g-2 ui-g-nopad">
      {{getStatusNameByStatus(job.jobStatus, job.jobType)}}
    </span>
    <span class="ui-g-2 ui-g-nopad">
      {{getCorrectAssigneeNames(job.assignee)}}
    </span>
  </div>
</div>
`
})
export class GameStatusComponent implements OnInit {
  @Input() game;

  constructor() { }

  ngOnInit() {
  }

  getJobNameByJobType(type) {
    return Job.getJobNameByType(type);
  }

  getStatusNameByStatus(status, type) {
    return Job.getJobStatusNameByStatus(status, type);
  }

  getCorrectAssigneeNames(assignee) {
    return Job.getCorrectAssigneeName(assignee);
  }
}
