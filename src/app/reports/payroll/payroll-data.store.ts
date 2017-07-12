import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { PayrollService } from './payroll.service';
import { Injectable } from '@angular/core';
import { Payroll } from './payroll.model';
import { DateTimeUtils } from '../../shared/utils/datetime-utils';
import * as moment from 'moment';
import { SecurityHttpService } from '../../shared/services/users.service';
import { HttpSportService } from '../../shared/services/sport.service';
import { GameRef } from '../../shared/entities/game-ref.entity';

export class Error {
  description: string;
  data: any;

  constructor(description, data) {
    this.description = description;
    this.data = data;
  }
}

@Injectable()
export class PayrollDataStore {

  private payrollRecords: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private payrollRecordsTotal: BehaviorSubject<number> = new BehaviorSubject(0);
  private periods: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private loggers: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private errors: Subject<Error> = new Subject();
  private checkedGame: BehaviorSubject<any> = new BehaviorSubject({});

  public payrollRecords$ = this.payrollRecords.asObservable().map(records => records.map(PayrollMapper.toDisplayModel));
  public payrollRecordsTotal$ = this.payrollRecordsTotal.asObservable();
  public periods$ = this.periods.asObservable();
  public loggers$ = this.loggers.asObservable();
  public loggersSuggestions$ = this.loggers$.map(loggers => loggers.map(x => ({
    name: `${x.first} ${x.last} (${x.iid})`,
    iid: x.iid
  })));
  public errors$ = this.errors.asObservable();
  public checkedGame$ = this.checkedGame.asObservable();

  public isLoading = false;

  constructor(
    private payrollHttp: PayrollService,
    private usersHttp: SecurityHttpService,
    private sportHttp: HttpSportService
  ) {
  }

  public loadPayrollPeriods() {
    this.payrollHttp.loadPayrollPeriods()
      .subscribe(data => this.periods.next(data.result));
  }

  public loadPayrollRecords(params) {
    this.isLoading = true;
    this.payrollHttp.loadPayroll(params)
      .subscribe(
        data => {
          this.isLoading = false;
          this.payrollRecords.next(data.result);
          this.payrollRecordsTotal.next(data.totalRecords);
        },
        error => this.errors.next(new Error('Could not load payroll records.', error))
      );
  }

  public searchLoggersByName(loggerName) {
    this.usersHttp.searchUserByText(loggerName, 0)
      .map(res => res.result)
      .subscribe(
        foundLoggers => this.loggers.next(foundLoggers)
      );
  }

  public createPayroll(payrollRecord) {
    payrollRecord.logger = this.loggers.value.find(x => x.iid === payrollRecord.loggerIid);
    if (!payrollRecord.logger) {
      throw new Error('Logger not set', null);
    }
    if (payrollRecord.gameId) {
      payrollRecord.game = new GameRef(this.checkedGame.value);
    }
    return this.payrollHttp.createPayroll(payrollRecord);
  }

  public loadGame(iid) {
    this.sportHttp.getGameByIid(iid)
      .map(res => res.result)
      .map(games => games.length > 0 ? games[0] : {})
      .catch(err => Observable.of({}))
      .subscribe(
        game => this.checkedGame.next(game)
      );
  }

  public setAdjustment(data) {
    const recordId = data.id;
    const adjustment = { value: data.adjustment, type: data.adjustmentType };
    return this.payrollHttp.updateAdjustment(recordId, adjustment);
  }

}

class PayrollMapper {
  public static toDisplayModel(p: Payroll) {

    let gameName = '-';
    if (p.game && p.game.homeTeam && p.game.awayTeam) {
      gameName = `${p.game.homeTeam.name}@${p.game.awayTeam.name}`;
    }

    const displayModel = Object.assign({}, p, {
      loggingDate: p.loggingDate ? moment.utc(p.loggingDate).format(DateTimeUtils.CalendarDateFormat) : '',
      gameName: gameName,
      rate: p.rateInfo ? p.rateInfo.amount : '-',
      rateType: p.rateInfo ? p.rateInfo.rateType ? 'PerGame' : 'PerHour' : '-',
      loggerName: p.logger ? `${p.logger.first} ${p.logger.last}` : '-',
      clipsPercent: p.clipsPercent ? p.clipsPercent.toFixed() + '%' : '-',
      amount: p.amount ? p.amount.toFixed(2) : '-'
    });
    if (p.relatedRecords.length > 0) {
      displayModel.relatedRecords = p.relatedRecords.map(PayrollMapper.toDisplayModel);
    }
    return displayModel;
  }
}
