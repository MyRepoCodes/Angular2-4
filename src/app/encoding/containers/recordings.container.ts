import { Component } from '@angular/core';
import { RecordingsFacade } from '../recordings.facade';
import { EncodingApiService } from '../api.service';

@Component({
  templateUrl: 'recordings.container.html',
  providers: [RecordingsFacade, EncodingApiService]
})
export class EncodingRecordingsComponent {
  constructor(public vm: RecordingsFacade) {

  }
}
