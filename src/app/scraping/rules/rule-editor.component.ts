import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ResolutionRuleset } from '../models';
import { ScrapingHttpService } from '../scraping.http.service';
import { ScrapingUtils } from '../scraping.utils';
import { NotificationService } from '../../shared/services/notification.service';
import { ScrapingValidators } from '../scraping.validators';
import { HttpSportService } from '../../shared/services/sport.service';

@Component({
  selector: 'sn-rule-editor',
  templateUrl: 'rule-editor.component.html',
  styles: [` .error-text { color: red; font-weight: bold; text-decoration: underline}`]
})

export class RuleEditorComponent implements OnInit {

  @Input() selectedType;

  @Input() set prefill(prefill: ResolutionRuleset) {
    if (prefill) {
      this.item = prefill;
      this.form.patchValue(prefill);
      if (prefill.id) {
        this.createMode = false;
      }
    }
  }

  @Output() saved = new EventEmitter();
  @Output() canceled = new EventEmitter();

  form: FormGroup;
  createMode = true;
  item = {};
  error;
  entityTypeOptions: SelectItem[] = [
    { label: 'Player', value: 'Player' },
    { label: 'Game', value: 'Game' },
    { label: 'Game Lineup', value: 'GameLineup' },
    { label: 'Team', value: 'Team' }
  ];

  teamsOptions: SelectItem[] = [
    { label: 'NO TEAM', value: '' },
  ];

  teamNamesOptions: SelectItem[] = [
    { label: 'NO TEAM', value: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private scrapingService: ScrapingHttpService,
    private sportService: HttpSportService,
    private notificationService: NotificationService
  ) {

    this.form = fb.group({
      enabled: true,
      entity: 'Player',
      scraperUrl: '',
      matchRules: fb.group({}),
      resolutionRules: fb.group({})
    });
    this.form.setValidators(ScrapingValidators.GameRule);
  }

  ngOnInit() {
    this.scrapingService.getEntityEndpoints()
      .map(res => res.result)
      .map(endpoints => endpoints.map(item => ({ label: item.name, value: item.endpoints[0] })))
      .subscribe(
        options => {
          this.teamsOptions = [
            ... this.teamsOptions,
            ... options
          ];
        },
        error => this.notificationService.showError('Could not load teams options.', error)
      );

    this.sportService.getTeamsByLeague((<any>this.item).leagueId)
      .map(res => res.result)
      .map(teams => teams.map(item => ({ label: item.fullName, value: item.fullName })))
      .subscribe(
        options => {
          this.teamNamesOptions = [
            ... this.teamNamesOptions,
            ... options
          ];
        },
        error => this.notificationService.showError('Could not load team names.', error)
      );
  }

  formErrorsAsArray() {
    const allErrors = [];
    const errors = this.getFormErrorsRecursively(this.form);

    if (errors) {
      Object.keys(errors).forEach(key => allErrors.push(errors[key]));
    }

    return allErrors;
  }

  getFormErrorsRecursively(form: FormGroup) {
    let nestedErrors = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control instanceof FormGroup && !control.valid) {
        nestedErrors = this.getFormErrorsRecursively(control);
      }
    });
    return Object.assign({}, form.errors, nestedErrors);
  }

  onTeamSelected(url) {
    this.form.patchValue({ scraperUrl: url });
  }

  onSaveButtonClick() {

    let itemToSave = <ResolutionRuleset>Object.assign({}, this.item, this.form.value);

    if (!itemToSave.scraperUrl) {
      if (!confirm('You are trying to save a rule without a scraper URL. Click OK only if you know what you are doing.')) {
        return;
      }
    }

    itemToSave = ScrapingUtils.prepareToSave(itemToSave);

    let saveFunction;
    if (this.createMode) {
      saveFunction = this.scrapingService.postRule(itemToSave);
    } else {
      saveFunction = this.scrapingService.putRule(itemToSave);
    }

    saveFunction.subscribe(
      () => this.saved.emit(this.createMode),
      (err) => this.error = err
    );
  }

  onCancelButtonClick() {
    this.canceled.emit(true);
  }

}
