import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  StbDevice,
  RemoteControlButtonAction,
  StbResponse,
  CommandType,
  AvermediaCommandType,
  AvermediaCommand,
  RemoteControlType,
  EncodingParameters
} from './encoding.entity';
import { EncodingApiService } from './api.service';
import { EncodingActions } from './encoding.actions';
import { EncodingAPIUrls } from './api.urls';
import { EncodingService } from './encoding.service';
import { NotificationService } from '../shared/services/notification.service';
import { EncodingState } from './encoding.state';

@Injectable()
export class EncodingPlayerFacade {
  public encodingStbList$;
  public selectedStb$: Observable<StbDevice>;
  public stbResponses$: Observable<StbResponse[]>;
  public availableAvermediaButtons$: Observable<any>;

  public selectedRemoteControl: RemoteControlType;

  public activeStb: StbDevice;

  public isMuted = false;
  public volume = 100;

  public encodingParameters: EncodingParameters;

  constructor(private encodingApiService: EncodingApiService,
              private encodingService: EncodingService,
              private notificationService: NotificationService) {
    const state = this.encodingService.state;

    this.encodingStbList$ = state.watcher$.map((s: EncodingState) => s.stbList);

    this.selectedStb$ = state.watcher$.map((s: EncodingState) => {
      return s.selectedStb;
    });

    this.selectedStb$.subscribe(stb => {
      this.activeStb = stb;
    });

    this.availableAvermediaButtons$ = state.watcher$.map((s: EncodingState) => s.availableAvermediaButtons || true);

    this.stbResponses$ = state.watcher$.map((s: EncodingState) => s.stbResponses);

    this.encodingParameters = { durationInHours: 5, gameId: '', nodeIpAddress: '', mongoGameId: '', stbId: '' };

    state.watcher$.subscribe((s: EncodingState) => {
      this.selectedRemoteControl = s.remoteControlType;
    });

    encodingService.loadStbList();
    encodingService.loadEncodingNodesList();
  }

  public goToPlayer(deviceId: string) {
    const state = this.encodingService.state;

    const sub = state.watcher$.subscribe((s: EncodingState) => {
      if (s.stbList) {
        const devices = s.stbList.filter((device: StbDevice) => device.id.toLowerCase() === deviceId.toLowerCase());
        if (devices.length > 0 && devices[0] !== this.activeStb) {
          this.setStb(devices[0]);
          if (sub) {
            sub.unsubscribe();
          }
        }
      }
    });
  }

  public setRemoteControl(selectedRemoteControl: RemoteControlType) {
    this.encodingService.dispatch({ type: EncodingActions.REMOTE_CONTROL_TYPE_CHANGED, payload: selectedRemoteControl });
  }

  public encodingStarted(data) {
    this.encodingService.startEncoding(data);
  }

  public encodingCanceled(data) {
    this.encodingService.cancelEncoding(data);
  }

  public loadGameInfo(gameId) {
    this.encodingService.loadGameInfo(gameId);
  }

  /*
   * Fired when user choosed STB from the list.
   */
  public setStb(stb: StbDevice) {
    this.encodingService.dispatch({ type: EncodingActions.SELECTED_STB_CHANGED, payload: stb });

    // const url = EncodingAPIUrls.API_AVERMEDIA_COMMANDS + '?deviceType=' + stb.type + '&deviceId=' + stb.id;
    // this.encodingApiService.getEntities(url).subscribe(o => {
    //   this.encodingService.dispatch({ type: EncodingActions.AVERMEDIA_BUTTONS_LIST_LOADED, payload: o });
    // });
  }

  /*
   * Fired when user would like to send sequence of commands
   */
  public controlSequenceRequested(commands) {
    for (let i = 0; i < commands.length; i++) {
      commands[i].id = this.activeStb.id;
    }

    this.encodingApiService.postEntity(EncodingAPIUrls.API_REMOTE_CONTROL_COMMANDS + this.activeStb.type + '/sequence',
                                       commands).subscribe(o => {
      this.encodingService.dispatch({ type: EncodingActions.STB_RESPONSE_RECEIVED, payload: o });
    });
  }

  /*
   * Fired when user click to remote control button.
   */
  public controlButtonClicked(info: RemoteControlButtonAction) {
    if (!this.activeStb) {
      this.notificationService.showWarn('Please choose Encoding stream before send command');
      return;
    }

    switch (info.type) {
      case CommandType.Volup:
        if (this.volume < 200) {
          this.volume++;
        }
        break;

      case CommandType.Voldown:
        if (this.volume > 0) {
          this.volume--;
        }
        break;

      case CommandType.Mute:
        this.isMuted = !this.isMuted;
        break;

      default:
        const tmp = { id: this.activeStb.id };
        const request = Object.assign(tmp, info);
        this.encodingApiService.postEntity(EncodingAPIUrls.API_REMOTE_CONTROL_COMMANDS + info.stbType, request).subscribe(o => {
          this.notificationService.showSuccess('Command to STB had been sent');
          this.encodingService.dispatch({ type: EncodingActions.STB_RESPONSE_RECEIVED, payload: o });
        });
        break;
    }
  }

  /*
   * Called when user click to avermedia button
   */
  public avermediaButtonClicked(type: AvermediaCommandType) {
    if (!this.activeStb) {
      this.notificationService.showWarn('Please choose Encoding stream before send command');
      return;
    }

    const request: AvermediaCommand = {
      id: this.activeStb.id,
      deviceType: this.activeStb.type,
      commandType: type
    };

    this.encodingApiService.postEntity(EncodingAPIUrls.API_AVERMEDIA_COMMANDS, request).subscribe(o => {
      console.log('Avermedia: ' + o);
    }, err => this.notificationService.showError('Couldn\'t send command to avermedia'));
  }
}
