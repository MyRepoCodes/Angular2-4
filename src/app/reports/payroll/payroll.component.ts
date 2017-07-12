import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollService } from './payroll.service';
import { CsvUtils } from '../shared';
import { FilterUtils } from '../../shared/utils';
import { NotificationService } from '../../shared/services/notification.service';
import { PayrollDataStore } from './payroll-data.store';
import { PayrollFilterStore, PayrollFilterState } from './payroll-filter.store';

@Component({
  selector: 'sn-payroll',
  template: `
<sn-page [title]="'Payroll'">

  <sn-loading-status [loading]="payrollData.isLoading" content="loading"></sn-loading-status>

  <div content="body">

    <sn-payroll-filter>
    </sn-payroll-filter>
  
    <div class="ui-g">
        <div class="ui-g-1">
          <button
            type="button" class="ui-button-warning" pButton icon="fa-file" iconPos="left" label="Generate" 
            (click)="displayPopup.generate = true"
            style="float:left" 
          ></button>
        </div>
        <div class="ui-g-1">
          <button
            type="button" pButton icon="fa-file-excel-o" iconPos="left" label="Totals" (click)="downloadTotalsReport()"
            style="float:left" [disabled]="!(canDownloadReport$ | async)"
          ></button>
        </div>
        <div class="ui-g-1">
         <button
           type="button" pButton icon="fa-file-excel-o " iconPos="left" label="Loggers" (click)="downloadLoggersReport()"
           style="float:left" [disabled]="!(canDownloadReport$ | async)"
         ></button>
        </div>
        <div class="ui-g-1">
         <button
           type="button" pButton icon="fa-file-excel-o " iconPos="left" label="Raw" (click)="downloadRawReport()"
           style="float:left" [disabled]="!(canDownloadReport$ | async)"
         ></button>
      </div>
    </div>
    
    <sn-payroll-list 
      [payrolls]="payrollData.payrollRecords$ | async" 
      (createPayroll)="displayPopup.create = true"
      (saveAdjustment)="setAdjustment($event)">
      <sn-paginator
        [page]="payrollFilter.page$ | async"
        [size]="payrollFilter.size$ | async"
        [total]="payrollData.payrollRecordsTotal$ | async"
        (onPageSelected)="goToPage($event)"
      ></sn-paginator>
    </sn-payroll-list>
    
    <p-dialog header="Add payroll record" [(visible)]="displayPopup.create" modal="modal" showEffect="fade" width="600">
      <sn-payroll-record-form
        (createRecord)="createPayrollRecord($event)"
        (cancel)="onPayrollRecordFormCancel()"
        (findLoggers)="findLoggers($event)"
        (checkGame)="loadGameByIid($event)"
        [checkedGame]="payrollData.checkedGame$ | async"
        [loggersSuggestions]="payrollData.loggersSuggestions$ | async"
        [periodId]="payrollFilter.periodId$ | async"
      ></sn-payroll-record-form>
    </p-dialog>
        
    <p-dialog header="Generate payrolls" [(visible)]="displayPopup.generate" modal="modal" showEffect="fade" width="300" #generationDialog>
      <sn-generate-payrolls (generateRequested)="requestPayrollsGeneration($event)">
      </sn-generate-payrolls>
    </p-dialog>
  
  </div>

</sn-page>
`,
  styles: [
    `
    .ui-dialog .ui-dialog-content {
      overflow: visible;
    }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit {

  displayPopup = {
    create: false,
    edit: false,
    generate: false
  };

  canDownloadReport$ = this.payrollFilter.periodId$.map(Boolean);

  constructor(
    public payrollData: PayrollDataStore,
    public payrollFilter: PayrollFilterStore,
    private route: ActivatedRoute,
    private router: Router,
    private payrollService: PayrollService,
    private notifications: NotificationService
  ) {
  }

  ngOnInit() {
    this.payrollData.loadPayrollPeriods();

    this.route.params
      .map(params => {
        const p = {
          sportId: params['sportId'],
          leagueId: params['leagueId'],
          competitionId: params['competitionId'],
          phase: params['phase'],
          page: +params['page'] || 1,
          size: +params['size'] || 25,
          orderBy: params['orderBy'],
          payrollPeriodId: params['payrollPeriodId'],
          generationTime: params['generationTime'],
          loggerIds: params['loggerIds'] ? params['loggerIds'].split(',') : [],
          sort: params['sort']
        };
        return FilterUtils.createSearchParams(p);
      })
      .subscribe(params => {
        this.payrollData.loadPayrollRecords(params);
        this.payrollFilter.updateFilter(params);
      });

    this.payrollFilter.searchRequest$
      .map(searchObject => FilterUtils.createSearchParams(searchObject))
      .subscribe(params => {
        this.router.navigate(['../payroll', params], { relativeTo: this.route });
      });

    this.payrollData.errors$.subscribe(x => this.notifications.showError(x.description, x.data.toString()));
  }

  goToPage(pagination) {
    this.payrollFilter.updateFilter(<PayrollFilterState>pagination);
    this.payrollFilter.requestSearch();
  }

  createPayrollRecord(record) {
    this.payrollData.createPayroll(record)
      .take(1)
      .subscribe(
        () => this.notifications.showSuccess('Record created'),
        error => this.notifications.showError('Could not create record', error)
      );
  };

  onPayrollRecordFormCancel() {
    this.displayPopup.create = false;
  }

  findLoggers(searchText) {
    this.payrollData.searchLoggersByName(searchText);
  }

  loadGameByIid(iid) {
    this.payrollData.loadGame(iid);
  }

  setAdjustment(data) {
    this.payrollData.setAdjustment(data)
      .subscribe(
        x => this.notifications.showSuccess('Adjustment updated.'),
        error => this.notifications.showError('Could not update adjustment.')
      );
  }

  requestPayrollsGeneration(payrollPeriodId) {
    this.payrollService.requestPayrollsGeneration(payrollPeriodId)
      .subscribe(
        () => this.notifications.showSuccess(
          'Payroll generation requested',
          'Please refresh the page in about 30 seconds to see new payrolls.'),
        error => this.notifications.showError(
          'Failed to request payroll generation'
        )
      );
    this.displayPopup.generate = false;
  }

  downloadRawReport() {
    this.payrollFilter.filter$
      .take(1)
      .map(filter => Object.assign({}, filter, { page: 1, size: 100000 }))
      // TODO workaround to generate totals report for all entries of period
      .subscribe(
        filter => this.payrollService.loadPayrollCsv(filter)
          .subscribe(res => CsvUtils.downloadCsv(res, 'payroll.csv'))
      );
  }

  downloadTotalsReport() {
    this.payrollFilter.periodId$
      .take(1)
      .subscribe(periodId => {
        this.payrollService.loadTotalsReport(periodId)
          .subscribe(
            res => CsvUtils.downloadCsv(res, 'totals.csv'),
            err => this.notifications.showError('Could not generate totals report', err)
          );
      });
  }

  downloadLoggersReport() {
    this.payrollFilter.periodId$
      .take(1)
      .subscribe(periodId => {
        this.payrollService.loadLoggersReport(periodId)
          .subscribe(
            res => CsvUtils.downloadCsv(res, 'loggers.csv'),
            err => this.notifications.showError('Could not generate loggers report', err)
          );
      });

  }

}

