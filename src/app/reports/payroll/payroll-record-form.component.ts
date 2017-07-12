import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityHttpService } from '../../shared/services/users.service';
import { HttpSportService } from '../../shared/services/sport.service';

@Component({
  selector: 'sn-payroll-record-form',
  templateUrl: 'payroll-record-form.component.html',
  styles: [
    `
    input {
      width: 100%;
    }
    
    .ui-grid-row {
      margin-bottom: 5px;
    }
    `
  ]
})
export class PayrollRecordFormComponent {

  @Output() createRecord = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() findLoggers = new EventEmitter();
  @Output() checkGame = new EventEmitter();

  @Input() set loggersSuggestions(suggestions) {
    this._loggersSuggestions = suggestions;
    this.autoCompleteCmp.show();
  };

  @Input() set checkedGame(game) {
    if (game) {
      if (!game.id) {
        this.gameIdCtrl.setErrors({ invalid: 'Invalid game IID' });
        this._checkedGame = null;
      } else {
        this._checkedGame = game;
      }
    }
  };

  @Input() set periodId(periodId) {
    this.payrollForm.patchValue({periodId: periodId});
  }

  @ViewChild('loggerAutoComplete') autoCompleteCmp;
  _loggersSuggestions;
  _checkedGame;

  payrollForm;

  typeOptions = [
    { label: 'Select Type', value: '' },
    { label: 'Regular Pay', value: '1' },
    { label: 'Training Pay', value: '2' },
    { label: 'Logging Bonus', value: '3' },
    { label: 'No Games on Shift', value: '4' },
    { label: 'Datacenter/Global Issue', value: '5' }
  ];

  constructor(
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  onSubmit() {
    this.createRecord.emit(this.payrollForm.value);
  }

  onCancel() {
    this.cancel.emit(true);
  }

  private createForm() {
    this.payrollForm = this.fb.group({
      periodId: ['', Validators.required],
      phase: ['', Validators.required],
      type: ['', Validators.required],
      loggerName: ['', Validators.required],
      loggerIid: ['', Validators.required],
      loggingDate: '',
      gameId: '',
      amount: ['', Validators.required],
      notes: ''
    });
  }

  searchLoggers(searchText) {
    if (searchText.length > 2) {
      this.findLoggers.emit(searchText);
    }
  }

  suggestionSelected(loggerSuggestion) {
    this.payrollForm.patchValue({
      loggerIid: loggerSuggestion.iid,
      loggerName: loggerSuggestion.name
    });
  }

  onGameIidInput(gameIid) {
    if (!gameIid) {
      this.gameIdCtrl.setErrors(null);
    } else {
      this.checkGame.emit(gameIid);
    }
  }

  // getters
  get amountCtrl() {
    return this.payrollForm.controls['amount'];
  }

  get phaseCtrl() {
    return this.payrollForm.controls['phase'];
  }

  get typeCtrl() {
    return this.payrollForm.controls['type'];
  }

  get gameIdCtrl() {
    return this.payrollForm.controls['gameId'];
  }

  get loggerNameCtrl() {
    return this.payrollForm.controls['loggerName'];
  }
}
