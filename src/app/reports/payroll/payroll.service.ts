import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api';
import { Filter } from '../../shared';
import { API_PAYROLL_SEARCH_URL, API_PAYROLL_URL, payrollPeriodLoggers } from '../../shared/api';
import { Observable } from 'rxjs/Observable';
import {
  payrollLoggersReport, payrollTotalsReport, payrollPeriodGenerationTimes,
  generatePayrolls, API_PAYROLL_PERIODS_URL, updateAdjustmentUrl
} from '../../shared/api/api.urls';

@Injectable()
export class PayrollService {

  constructor(private api: ApiService) {
  }

  loadPayrollPeriods() {
    return this.api.searchEntities(API_PAYROLL_PERIODS_URL);
  }

  loadPayroll(params) {
    return this.loadPayrollImpl(params);
  }

  loadPayrollCsv(params) {
    return this.loadPayrollImpl(params, 'text/csv');
  }

  createPayroll(payroll) {
    return this.api.postEntity(API_PAYROLL_URL, payroll);
  }

  updatePayroll(payroll) {
    return this.api.putEntity(API_PAYROLL_URL, payroll.id, payroll);
  }

  updateAdjustment(recordId, adjustment) {
    return this.api.putEntity(updateAdjustmentUrl(recordId), null, adjustment);
  }

  loadLoggersReport(payrollPeriod, generationTime = null) {
    const filter = new Filter();
    if (generationTime) {
      filter.add('generationTime', generationTime);
    }
    return this.api.searchEntities(payrollLoggersReport(payrollPeriod), filter.getParams());
  }

  loadTotalsReport(payrollPeriod, generationTime = null) {
    const filter = new Filter();
    if (generationTime) {
      filter.add('generationTime', generationTime);
    }
    return this.api.searchEntities(payrollTotalsReport(payrollPeriod), filter.getParams());
  }

  loadLoggersByPayrollPeriodNumber(payrollPeriodId) {
    // todo: use proper url
    return this.api.searchEntities(payrollPeriodLoggers(payrollPeriodId))
      .map(res => res.result)
      .catch(err => Observable.of([]));
  }

  loadGenerationTimesForPeriod(payrollPeriodId) {
    return this.api.searchEntities(payrollPeriodGenerationTimes(payrollPeriodId))
      .catch(err => Observable.of([]));
  }

  requestPayrollsGeneration(payrollPeriodId) {
    return this.api.putEntity(generatePayrolls(payrollPeriodId), null, null);
  }

  private loadPayrollImpl(params, acceptType = undefined) {
    const filter = Filter.createByType(params, 'payrollFilter');
    const data = [];

    return this.api.searchEntities(API_PAYROLL_SEARCH_URL, filter.getParams(), acceptType)
      .catch(err => Observable.of({ result: data, totalRecords: data.length }));
  }
}
