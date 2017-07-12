import { Component, OnInit, Input } from '@angular/core';
import { PayrollDataStore } from './payroll-data.store';
import { PayrollFilterStore, PayrollFilterState } from './payroll-filter.store';

@Component({
  selector: 'sn-payroll-filter',
  template: `
<div class="ui-g">
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-2">
          <sn-payroll-period
            [periods]="payrollData.periods$ | async"
            [payrollPeriod]="payrollFilter.periodId$ | async"
            (payrollPeriodChanged)="setParam('payrollPeriodId', $event)"
          ></sn-payroll-period>
        </div>
        <div class="ui-g-2">
          <!--<sn-select-generation-time-->
            <!--[payrollPeriod]="params['payrollPeriodId']"-->
            <!--[generationTime]="params['generationTime']"-->
            <!--(generationTimeSelected)="setParam('generationTime', $event)"-->
            <!--(optionsLoaded)="generationTimesOptionsLoaded($event)"-->
          <!--&gt;</sn-select-generation-time>-->
        </div>
        <div class="ui-g-2">
          <sn-select-game-phase
            [phase]="payrollFilter.phase$ | async"
            (phaseChanged)="setParam('phase', $event)"
          ></sn-select-game-phase>
        </div>
        <div class="ui-g-2">
          <sn-select-logger
            [payrollPeriod]="payrollFilter.periodId$ | async"
            [selectedLoggers]="payrollFilter.loggerIds$ | async"
            (loggerChanged)="setParam('loggerIds', $event)"
          ></sn-select-logger>
        </div>  
      </div>
        
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-2">
          <sn-select-sport
            [sport]="payrollFilter.sportId$ | async"
            (sportChanged)="setParam('sportId', $event)"
          ></sn-select-sport>
        </div>
        <div class="ui-g-2">
          <sn-select-league
            [sport]="payrollFilter.sportId$ | async"
            [league]="payrollFilter.leagueId$ | async"
            (leagueChanged)="setParam('leagueId', $event)"
          ></sn-select-league>
        </div>
        <div class="ui-g-2">
          <sn-select-competition
            [league]="payrollFilter.leagueId$ | async"
            [competition]="payrollFilter.leagueId$ | async"
            (competitionChanged)="setParam('competitionId', $event)"
          ></sn-select-competition>
        </div>
        <div class="ui-g-2">
          <sn-select-payroll-sorting
            (sortChanged)="setParam('sort', $event)"
          ></sn-select-payroll-sorting>
        </div>
        <div class="ui-g-2">
          <button pButton icon="fa-search" type="button" label="Search" (click)="search()" ></button>
        </div>
      </div>
      
</div>
<div class="SeparatorFull"></div>
`
})
export class PayrollFilterComponent {

  constructor(
    public payrollData: PayrollDataStore,
    public payrollFilter: PayrollFilterStore
  ) {
  }

  search() {
    this.payrollFilter.requestSearch(true);
  }

  setParam(name: string, value: any) {
    const filterValue = <PayrollFilterState>{};
    filterValue[name] = value;
    this.payrollFilter.updateFilter(filterValue);
  }
}
