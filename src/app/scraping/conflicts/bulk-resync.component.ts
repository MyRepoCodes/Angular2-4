import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ScrapingHttpService } from '../scraping.http.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'sn-bulk-resync',
  templateUrl: 'bulk-resync.component.html',
  styles: [` input.ng-invalid {border: solid red 1px}`]
})
export class BulkResyncComponent {

  @Input() entityType;

  @Input() set prefill(data) {
    if (data.sport) {
      data.sportIid = data.sport;
    }
    this.form.patchValue(data);
  }

  @Output() resyncRequested = new EventEmitter();

  form;

  constructor(
    private fb: FormBuilder,
    private scrapingService: ScrapingHttpService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      sportIid: ['', Validators.required],
      leagueIid: ['', Validators.required],
      scraperId: ['', Validators.required],
      scraperUrl: ['', Validators.required],
      batch: '',
      subBatch: '',
      message: ''
    });
  }

  onSubmit() {
    this.scrapingService.bulkResync(this.entityType, this.form.value)
      .subscribe(
        () => {
          this.notificationService.showSuccess('Bulk Resync Successfully Requested');
          this.resyncRequested.emit(true);
        },
        error => this.notificationService.showError('Bulk Resync Error', error)
      );
  }

}
