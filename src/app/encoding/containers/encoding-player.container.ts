import { Component, OnInit, Input } from '@angular/core';
import { EncodingPlayerFacade } from '../encoding-player.facade';

import { EncodingApiService } from '../api.service';
import { RemoteControlType } from '../encoding.entity';

@Component({
  selector: 'sn-encoding-player-container',
  templateUrl: 'encoding-player.container.html',
  providers: [EncodingPlayerFacade, EncodingApiService]
})
export class EncodingPlayerContainerComponent implements OnInit {
  @Input()
  public deviceId: string;

  // additional variable to use RemoteControlType inside template
  public remoteControlTypeWrapper = RemoteControlType;

  constructor(public vm: EncodingPlayerFacade) {

  }

  ngOnInit() {
    if (this.deviceId) {
      this.vm.goToPlayer(this.deviceId);
    }
  }
}
