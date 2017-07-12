import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EncodingState } from './encoding.state';
import { EncodingApiService } from './api.service';
import { EncodingAPIUrls } from './api.urls';
import { EncodingActions } from './encoding.actions';
import { StbDevice, RecordingData, DbRecording } from './encoding.entity';
import { EncodingService } from './encoding.service';
import { Subscription } from 'rxjs/Subscription';
import { NotificationService } from '../shared/services/notification.service';

@Injectable()
export class RecordingsFacade {
  public recordings$: Observable<RecordingData[]>;
  public devices = {};
  public isDialogVisible = false;

  public selectedRecordingData: RecordingData;
  public selectedRecord: DbRecording;
  selectedSchedule;
  private stbListSubscription: Subscription;

  constructor(private api: EncodingApiService,
              private encodingService: EncodingService,
              private notificationService: NotificationService) {
    encodingService.loadStbList();

    const state = encodingService.state;

    this.recordings$ = state.watcher$.map((s: EncodingState) => s.recordings.sort((rd1, rd2) => {
      const d1 = this.getDeviceInfo(rd1.deviceId);
      const d2 = this.getDeviceInfo(rd2.deviceId);
      return d1.name.localeCompare(d2.name);
    }));
    this.stbListSubscription = state.watcher$.subscribe((s: EncodingState) => {
      if (s.stbList) {
        for (const device of s.stbList) {
          this.devices[device.id] = device;
        }
        this.loadRecordings(s.stbList);
      }
      if (this.stbListSubscription) {
        this.stbListSubscription.unsubscribe();
      }
    });
  }

  public removeRecording(recordingData: RecordingData, record: DbRecording) {
    this.notificationService.showError('This functionality unavailable until we won\'t have access to DirecTv API');
    return;

    // let url = EncodingAPIUrls.REMOVE_RECORD_URL;
    // this.api.deleteEntity(url, record.id).subscribe(r => {
    //   this.store.dispatch({ type: EncodingActions.RECORD_REMOVED, payload: {data: recordingData, record: record, response: r}});
    // });
  }

  public showVideo(recordingDate: RecordingData, record: DbRecording) {
    this.notificationService.showError('This functionality unavailable until we won\'t have access to DirecTv API');
    return;

    // this.encodingService.goToSpecificStb(recordingDate.deviceId);
  }

  public onRecordingClicked(recordingData: RecordingData, record: DbRecording) {
    this.isDialogVisible = true;
    this.selectedRecordingData = recordingData;
    this.selectedRecord = record;
  }

  public encodeShow(recordingData: RecordingData, record: DbRecording) {
    this.notificationService.showError('This functionality unavailable yet');
    return;

    // let url = EncodingAPIUrls.getEncodeRecordUrl(record.id);
    // this.api.postEntity(url, record.id).subscribe(r => {
    //
    // });
  }

  public hideDialog() {
    this.isDialogVisible = false;
  }

  private loadRecordings(devices: StbDevice[]) {
    for (const device of devices) {
      const url = EncodingAPIUrls.getDeviceRecordingsUrl(device.id);
      this.api.getEntities(url).subscribe(r => {
        this.encodingService.dispatch({
          type: EncodingActions.RECORDINGS_LIST_LOADED,
          payload: { recordings: r, deviceId: device.id }
        });
      });
    }
  }

  private getDeviceInfo(id: string): StbDevice {
    return this.devices[id];
  }
}
