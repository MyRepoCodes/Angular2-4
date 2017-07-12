import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

export interface PayrollFilterState {
  payrollPeriodId: string;
  phase: number;
  loggerIds: string[];
  sportId: string;
  leagueId: string;
  competitionId: string;
  page: number;
  size: number;
}

const initialFilterState: PayrollFilterState = {
  payrollPeriodId: '',
  phase: null,
  loggerIds: [],
  sportId: '',
  leagueId: '',
  competitionId: '',
  page: 1,
  size: 25
};

@Injectable()
export class PayrollFilterStore {

  private filter: BehaviorSubject<PayrollFilterState> = new BehaviorSubject(initialFilterState);
  private searchRequest: BehaviorSubject<PayrollFilterState> = new BehaviorSubject(null);

  public filter$ = this.filter.asObservable();
  public periodId$ = this.filter$.pluck('payrollPeriodId').distinctUntilChanged();
  public phase$ = this.filter$.pluck('phase').distinctUntilChanged();
  public loggerIds$ = this.filter$.pluck('loggerIds').distinctUntilChanged();
  public sportId$ = this.filter$.pluck('sportId').distinctUntilChanged();
  public leagueId$ = this.filter$.pluck('leagueId').distinctUntilChanged();
  public competitionId$ = this.filter$.pluck('competitionId').distinctUntilChanged();
  public page$ = this.filter$.pluck('page');
  public size$ = this.filter$.pluck('size').distinctUntilChanged();

  public searchRequest$ = this.searchRequest.asObservable().filter(x => x !== null);

  public updateFilter(filter: PayrollFilterState) {
    this.filter.next(Object.assign({}, this.filter.value, filter));
  }

  public requestSearch(resetPage: boolean = false) {
    const searchRequestFilter = Object.assign({}, this.filter.value);
    if (resetPage) {
      searchRequestFilter.page = 1;
    }
    this.searchRequest.next(searchRequestFilter);
  }

}
