import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrapingHttpService, ScrappedItemStatus } from '../scraping.http.service';

@Component({
  selector: 'sn-conflict-details',
  templateUrl: 'conflict-details.component.html',
  styles: [` .label { font-weight: bold}`]
})
export class ConflictDetailsComponent implements OnInit {

  @Input() conflict;
  @Input() entityType;

  @Output() resolved = new EventEmitter();

  resolution;
  loading;
  ignoring;
  resyncError;

  ruleCreated = false;
  isDuplicate;

  constructor(
    private scrapingService: ScrapingHttpService
  ) {
  }

  ngOnInit() {
    this.loadResolution();
  }

  loadResolution() {
    this.loading = true;
    this.scrapingService.getResolution(this.entityType, this.conflict.id)
      .map(res => res.result)
      .subscribe(
        result => {
          this.resolution = result;
          this.isDuplicate = this.resolution.resolvedStatus === 'Duplicate';
        },
        () => {
        },
        () => this.loading = false
      );
  }

  toggleIgnoreReasonInput() {
    this.ignoring = !this.ignoring;
  }

  resyncItem() {
    this.updateScrappedItemStatus(ScrappedItemStatus.Resync);
  }

  addItem() {
    if (confirm('Add New item?')) {
      this.updateScrappedItemStatus(ScrappedItemStatus.CreateNew);
    }
  }

  ignoreItem(message) {
    this.updateScrappedItemStatus(ScrappedItemStatus.Ignore, message);
  }

  updateScrappedItemStatus(status: ScrappedItemStatus, message?) {
    this.scrapingService.updateScrappedItemStatus(this.entityType, status, this.conflict.id, message)
      .subscribe(
        () => {
          this.setConflictStatus(status);
          this.resolved.emit(true);
        },
        () => this.resyncError = true
      );
  }

  setConflictStatus(resyncType: ScrappedItemStatus) {
    let status;
    switch (resyncType) {
      case ScrappedItemStatus.CreateNew:
        status = 'Add New';
        break;
      case ScrappedItemStatus.Ignore:
        status = 'Ignore';
        break;
      default:
        status = 'Resync';
        break;
    }
    this.conflict.status = status;
  }

  isSuitableStatus() {
    return this.conflict.status === 'Conflict' || this.conflict.status === 'UnresolvableDependencies';
  }

}
