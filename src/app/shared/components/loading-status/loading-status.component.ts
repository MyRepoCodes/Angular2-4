import { Component, Input } from '@angular/core';

@Component({
  selector: 'sn-loading-status',
  template: `
<ng-template [ngIf]="loading">
  <i class="fa fa-circle-o-notch fa-spin fa-fw" style="float:right"></i>
  <span class="sr-only" style="float:right">Loading...</span>
</ng-template>
`
})
export class LoadingStatusComponent {
  @Input() loading: boolean;
}
