import { Component, EventEmitter, Output } from '@angular/core';
import { FilterStateService } from '../../filter-state.service';
import { Observable } from 'rxjs/Observable';

@Component({
  'selector': 'sn-filter-component',
  'template': `<ng-content></ng-content>`
})
export class FilterComponent {
  private localState = {};

  @Output()
  public onSearch = new EventEmitter(true);

  constructor(private filterStateService: FilterStateService) {
  }

  public setValue(key: string, id: string): void {
    this.localState[key] = id;
  }

  public getValue(key: string): string {
    return this.filterStateService.getId(key);
  }

  public getValueAsync(key: string): Observable<string> {
    return Observable.of(this.getValue(key));
  }

  public onSearchClick(e) {
    this.storeValues();
    this.onSearch.emit(e);
  }

  public addValues(key: string, ids: string[]): void {
    this.localState[key] = [];
    for (const id of ids) {
      this.localState[key].push(id);
    }
  }

  public getValues(key: string) {
    const urlValues = this.filterStateService.getId(key);
    if (urlValues) {
      if (typeof urlValues === 'string') {
        return urlValues.split(',');
      } else if (Array.isArray(urlValues)) {
        return urlValues;
      }
    }
    return null;
  }

  private storeValues() {
    for (const prop in this.localState) {
      if (this.localState.hasOwnProperty(prop)) {
        this.filterStateService.storeId(prop, this.localState[prop]);
      }
    }
  }
}
