import { Component } from '@angular/core';
import { EncodingScheduleFacade } from '../encoding-schedule.facade';
import { EncodingApiService } from '../api.service';

@Component({
  selector: 'sn-encoding-schedule-container',
  templateUrl: 'encoding-schedule.container.html',
  providers: [EncodingScheduleFacade, EncodingApiService]
})
export class EncodingScheduleComponent {
  constructor(public vm: EncodingScheduleFacade) {

  }
}
