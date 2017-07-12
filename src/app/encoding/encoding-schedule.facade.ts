import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EncodingState } from './encoding.state';
import { EncodingApiService } from './api.service';
import { EncodingAPIUrls } from './api.urls';
import { EncodingActions } from './encoding.actions';
import { StbType, DirecTvChannel, DirecTvSchedule, DirecTvScheduleRequest, StbDevice } from './encoding.entity';
import { RequestOptions, RequestMethod } from '@angular/http';
import { EncodingService } from './encoding.service';
import { NotificationService } from '../shared/services/notification.service';

@Injectable()
export class EncodingScheduleFacade {
  public LINES_COUNT = 20;
  public selectedSchedule: DirecTvSchedule;
  public selectedChannel: DirecTvChannel;
  public isScheduleDialogVisible = false;
  public schedule$: Observable<DirecTvChannel[]>;
  public devices$: Observable<StbDevice[]>;
  public selectedStb$: Observable<StbDevice>;

  private WIDTH_FACTOR = 5;
  private INITIAL_SHIFT = 10;
  private SCHEDULE_ITEM_MARGIN = 25;

  private channels: DirecTvChannel[];



  constructor(private api: EncodingApiService,
              private encodingService: EncodingService,
              private notificationService: NotificationService) {
    encodingService.loadStbList();

    const state = this.encodingService.state;
    this.schedule$ = state.watcher$.map((s: EncodingState) => s.direcTvSchedule);
    this.devices$ = state.watcher$.map((s: EncodingState) => s.stbList);
    this.selectedStb$ = state.watcher$.map((s: EncodingState) => s.selectedStb);

    state.watcher$.subscribe((s: EncodingState) => {
      this.channels = s.direcTvChannels;
      const count = s.direcTvSchedule.length;
      if (count === 0) {
        this.loadSchedule({ first: 0, rows: this.LINES_COUNT });
      }
    });

    this.loadChannels();
  }

  public getScheduleStyle(channel: DirecTvChannel, scheduleItem: DirecTvSchedule) {
    let shift = this.INITIAL_SHIFT;

    for (let i = 0; i < channel.schedules.length; i++) {
      const current: DirecTvSchedule = channel.schedules[i];
      if (scheduleItem === current) {
        break;
      }
      shift += this.calculateItemWidth(current) + this.SCHEDULE_ITEM_MARGIN;
    }

    return {
      width: this.calculateItemWidth(scheduleItem) + 'px',
      top: '5px',
      left: shift + 'px'
    };
  }

  public getButtonShift(channel: DirecTvChannel) {
    let shift = this.INITIAL_SHIFT;
    for (let i = 0; i < channel.schedules.length; i++) {
      shift += this.calculateItemWidth(channel.schedules[i]) + this.SCHEDULE_ITEM_MARGIN;
    }

    return shift + this.SCHEDULE_ITEM_MARGIN + 'px';
  }

  public scheduleClicked(channel: DirecTvChannel, scheduleItem: DirecTvSchedule) {
    this.selectedSchedule = scheduleItem;
    this.selectedChannel = channel;
    this.isScheduleDialogVisible = true;
  }

  public loadAdditionalShows(channel: DirecTvChannel) {
    const scheduleItem = channel.schedules[channel.schedules.length - 1];
    const date = new Date(scheduleItem.airTime);
    date.setMinutes(date.getMinutes() + scheduleItem.duration);

    const request: DirecTvScheduleRequest = {
      channels: [channel],
      hoursCount: 8,
      startDate: date.toISOString()
    };
    const url = EncodingAPIUrls.getScheduleUrl(StbType.DirecTv);
    const options: RequestOptions = new RequestOptions(
      {
        url: url,
        body: EncodingApiService.stringify(request),
        method: RequestMethod.Post
      }
    );


    this.api.request(options).subscribe(r => {
      this.encodingService.dispatch({ type: EncodingActions.ADDITIONAL_SCHEDULE_LOADED, payload: r });
    });
  }

  public scheduleTime(scheduleItem: DirecTvSchedule) {
    const beginDate = new Date(scheduleItem.airTime);
    const endDate = new Date(scheduleItem.airTime);
    endDate.setMinutes(endDate.getMinutes() + scheduleItem.duration);

    return beginDate.toLocaleTimeString() + ' - ' + endDate.toLocaleTimeString();
  }

  public encodeShow(channel: DirecTvChannel, scheduleItem: DirecTvSchedule) {
    this.notificationService.showError('This functionality isn\'t available yet');
    return;

    // if (!device) {
    //   alert('Please select device before start live encoding');
    //   return;
    // }

    // const url = EncodingAPIUrls.getEncodeShowUrl(StbType.DirecTv);
    // const options: RequestOptions = new RequestOptions(
    //   {
    //     url: url,
    //     body: EncodingApiService.stringify(scheduleItem),
    //     method: RequestMethod.Put
    //   }
    // );
    //
    // this.api.request(options).subscribe(r => {
    //   alert(r);
    //   this.hideScheduleDialog();
    // });
  }

  public recordShow(channel: DirecTvChannel, scheduleItem: DirecTvSchedule) {
    let device: StbDevice;
    this.selectedStb$.take(1).subscribe((l) => {
      device = l;
    });
    if (!device) {
      this.notificationService.showWarn('Please select device before start recording');
      return;
    }

    const url = EncodingAPIUrls.getRecordShowUrl(StbType.DirecTv, device.id);
    const data = {
      channelNumber: channel.chNum,
      beginDate: scheduleItem.airTime,
      duration: scheduleItem.duration,
    };
    const options: RequestOptions = new RequestOptions(
      {
        url: url,
        body: EncodingApiService.stringify(data),
        method: RequestMethod.Put
      }
    );

    this.notificationService.showInfo('You will be redirected to player to have visual control of configuring device');

    this.api.request(options).subscribe(r => {
      this.hideScheduleDialog();
    });
    this.encodingService.goToSpecificStb(device.id);
  }

  public hideScheduleDialog() {
    this.isScheduleDialogVisible = false;
  }

  public onChannelClicked(channel: DirecTvChannel) {
    console.log('channel clicked');
  }

  public deviceChanged(device: StbDevice) {
    this.encodingService.dispatch({ type: EncodingActions.SELECTED_STB_CHANGED, payload: device });
  }

  private loadChannels() {
    const url = EncodingAPIUrls.getChannelsUrl(StbType.DirecTv);
    const data = this.api.getEntities(url);
    data.subscribe(o => {
      this.encodingService.dispatch({ type: EncodingActions.CHANNELS_LIST_LOADED, payload: o });
    });
  }

  public loadSchedule(event) {
    if (!this.channels) {
      return;
    }

    console.log('LoadSchedule started');

    const url = EncodingAPIUrls.getScheduleUrl(StbType.DirecTv);

    const channels = this.channels.slice(event.first, event.first + event.rows);
    if (channels.length === 0) {
      return;
    }
    const request: DirecTvScheduleRequest = {
      channels: channels,
      hoursCount: 8,
      startDate: (new Date()).toISOString()
    };

    const options: RequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      body: EncodingApiService.stringify(request)
    });
    const data = this.api.request(options);
    data.subscribe(o => {
      console.log('Schedule loaded');
      this.encodingService.dispatch({ type: EncodingActions.SCHEDULE_LOADED, payload: o });
    });
  }

  // get width of schedule item
  private calculateItemWidth(item: DirecTvSchedule) {
    return item.duration * this.WIDTH_FACTOR;
  };
}
