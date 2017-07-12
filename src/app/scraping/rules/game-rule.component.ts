import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ScrapingValidators } from '../scraping.validators';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';

@Component({
  selector: 'sn-game-rule',
  templateUrl: 'game-rule.component.html',
  styles: [
    `
      .included {
        color: green;
        font-weight: bold;
        text-decoration: underline;
      }
      
      .score-input {
        width: 20%; 
        display: inline;
      }
      
    `
  ]
})
export class GameRuleComponent implements OnInit {

  @Input() isResolution = false;

  @Input() set formGroupRef(formGroup: FormGroup) {

    this.form = formGroup;

    formGroup.controls = {};
    formGroup.reset();

    formGroup.addControl('gameTeams', new FormGroup({
      homeTeam: new FormControl(''),
      awayTeam: new FormControl('')
    }));
    formGroup.addControl('doubleHeader', new FormControl(0));

    if (this.isResolution) {
      formGroup.addControl('iidHint', new FormControl());
      formGroup.addControl('gameTime', new FormGroup({
        utcDate: new FormControl('')
      }));
    } else {
      formGroup.addControl('gameTime', new FormGroup({
        gameDate: new FormControl(''),
        utcDate: new FormControl('')
      }));
      formGroup.addControl('score', new FormGroup(
        {
          awayTeamRuns: new FormControl(''),
          awayTeamHits: new FormControl(''),
          awayTeamErrors: new FormControl(''),
          homeTeamRuns: new FormControl(''),
          homeTeamHits: new FormControl(''),
          homeTeamErrors: new FormControl(''),
        },
        ScrapingValidators.GameScore)
      );
    }
  }

  @Input() set data(rule) {
    if (rule) {
      this.setUpDateValues(rule.gameTime);
      this.form.patchValue(rule);
    }
  }

  doubleHeaderOptions = [
    { label: 'Ignore', value: 0 },
    { label: 'NoDH', value: -1 },
    { label: '1st', value: 1 },
    { label: '2nd', value: 2 },
  ];

  form: FormGroup;

  setUpDateValues(gTime) {
    if (gTime) {
      if (gTime.utcDate && typeof gTime.utcDate === 'string') {
        const localDate = new Date(gTime.utcDate);
        gTime.utcDate = DateTimeUtils.DateToUtcValue(localDate);
      }
      if (gTime.gameYear && gTime.gameMonth && gTime.gameDay) {
        gTime.gameDate = new Date(gTime.gameYear, gTime.gameMonth - 1, gTime.gameDay);
      }
    }
  }

  constructor() {
  }

  ngOnInit() {

  }
}
