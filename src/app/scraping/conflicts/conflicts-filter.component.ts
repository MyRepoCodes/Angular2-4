import { Component, Output, EventEmitter } from '@angular/core';
import { ConflictsSearchObject, ScrapingHttpService } from '../scraping.http.service';

@Component({
  selector: 'sn-conflicts-filter',
  templateUrl: 'conflicts-filter.component.html',
  styles: [`:host {display: block; width: 100%;}`]
})
export class ConflictsFilterComponent {

  @Output() change = new EventEmitter();

  value: ConflictsSearchObject = <ConflictsSearchObject>{
    statuses: ['Conflict', 'UnresolvableDependencies', 'Invalid']
  };

  scraperOptions = [
    { label: 'Any', value: '' }
  ];

  statusOptions = [
    { label: 'Conflict', value: 'Conflict' },
    { label: 'UnresolvableDependencies', value: 'UnresolvableDependencies' },
    { label: 'Ignored', value: 'Ignored' },
    { label: 'ReSync', value: 'ReSync' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Invalid', value: 'Invalid' },
    { label: 'ReSyncAndCreateNew', value: 'ReSyncAndCreateNew' },
    { label: 'Created', value: 'Created' },
    { label: 'Updated', value: 'Updated' },
    { label: 'Duplicate', value: 'Duplicate' },
  ];

  constructor(
    private scrapingService: ScrapingHttpService
  ) {
  }

  getScrapers() {
    this.scrapingService.getScrapers(this.value.entity)
      .subscribe(res => {
          this.scraperOptions = [
            ... this.scraperOptions,
            ... (res as any).map(item => {
              return { label: item.scraperId, value: item.scraperId };
            })
          ];
        }
      );
  }

  onNestedFilterChange(value) {
    const prevEntityVal = this.value.entity;
    this.value = Object.assign({}, this.value, value);
    if (!prevEntityVal || prevEntityVal !== this.value.entity) {
      this.getScrapers();
    }
    this.onChange();
  }

  onChange() {
    this.change.emit(this.value);
  }

}
