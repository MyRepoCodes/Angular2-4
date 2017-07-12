import {
  StbDevice, StbResponse, DirecTvChannel, RecordingData,
  RemoteControlType, EncodingResult, DbRecording
} from './encoding.entity';
import { EncodingActions } from './encoding.actions';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class EncodingState {
  static this_NAME = 'encoding';

  public stbList: StbDevice[];
  public selectedStb: StbDevice;
  public availableAvermediaButtons: any;

  public stbResponses: StbResponse[];

  public direcTvChannels: DirecTvChannel[];
  public direcTvSchedule: DirecTvChannel[];

  public recordings: RecordingData[];

  public remoteControlType: RemoteControlType;

  public encodingNodes: string[];

  public gameInfo: any;

  public encodingResult: EncodingResult;

  private subject: Subject<EncodingState>;

  public watcher$: Observable<EncodingState>;

  constructor() {
    this.stbResponses = [];
    this.direcTvSchedule = [];
    this.recordings = [];
    this.remoteControlType = RemoteControlType.StbRemote;

    this.subject = new Subject<EncodingState>();
    this.watcher$ = this.subject.asObservable();
  }

  public dispatch(action: EncodingActions, payload: any) {
    switch (action) {
      case EncodingActions.STB_LIST_LOADED:
        this.stbList = payload;
        break;

      case EncodingActions.SELECTED_STB_CHANGED:
        this.selectedStb = payload;
        break;

      case EncodingActions.STB_RESPONSE_RECEIVED:
        if (this.stbResponses.length > 25) {
          this.stbResponses.pop();
        }
        this.stbResponses.unshift(payload);
        break;

      case EncodingActions.AVERMEDIA_BUTTONS_LIST_LOADED:
        this.availableAvermediaButtons = payload;
        break;

      case EncodingActions.CHANNELS_LIST_LOADED:
        this.direcTvChannels = payload;
        break;

      case EncodingActions.SCHEDULE_LOADED:
        if (!payload || payload.length === 0) {
          return;
        }
        const channels = this.direcTvSchedule.slice(0);
        for (let i = 0; i < payload.length; i++) {
          channels.push(payload[i]);
        }
        this.direcTvSchedule = channels;
        break;

      case EncodingActions.ADDITIONAL_SCHEDULE_LOADED:
        const channel: DirecTvChannel = payload[0];
        this.direcTvSchedule.forEach((c: DirecTvChannel) => {
          if (c.chId === channel.chId) {
            channel.schedules.forEach(s => c.schedules.push(s));
          }
        });
        break;

      case EncodingActions.RECORDINGS_LIST_LOADED:
        const recordings: DbRecording[] = payload.recordings;
        const deviceId: string = payload.deviceId;
        const results = this.recordings.filter((r) => r.deviceId === deviceId);
        if (results.length > 0) {
          results[0].recordings = recordings;
        } else {
          this.recordings.push({ deviceId: deviceId, recordings: recordings});
        }
        break;

      case EncodingActions.REMOTE_CONTROL_TYPE_CHANGED:
        this.remoteControlType = payload;
        break;

      case EncodingActions.ENCODING_NODES_LIST_LOADED:
        this.encodingNodes = payload;
        break;

      case EncodingActions.GAME_INFO_LOADED:
        this.gameInfo = payload.result[0];
        break;

      case EncodingActions.ENCODING_STARTED:
        this.encodingResult = payload;
        break;
    }
    this.subject.next(this);
  }
}
