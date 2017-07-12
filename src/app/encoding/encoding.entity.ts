export class StbDevice {
  id: string;
  name: string;
  streamUri: string;
  type: StbType;
  deviceHost: string;
  avermediaHost: string;
}

export enum CommandType {
  Unknown = 0,
  Power,
  Poweron,
  Poweroff,
  Format,
  Pause,
  Rew,
  Replay,
  Stop,
  Advance,
  Ffwd,
  Record,
  Play,
  Guide,
  Active,
  List,
  Exit,
  Back,
  Menu,
  Info,
  Up,
  Down,
  Left,
  Right,
  Select,
  Red,
  Green,
  Yellow,
  Blue,
  Chanup,
  Chandown,
  Prev,
  D0,
  D1,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
  D8,
  D9,
  Dash,
  Enter,

  Volup,
  Voldown,
  Mute,

  Home,
  OK,

  Raw
}

export enum CommandAction {
  Unknown = 0,
  KeyUp,
  KeyDown,
  KeyPress
}

export enum StbType {
  Unknown = 0,
  DirecTv,
  Roku,
  Dish
}

export class RemoteControlButtonAction {
  public type: CommandType;
  public action: CommandAction;
  public stbType: string;
  public rawValue: string;
}

class StbStatus {
  query: string;
  code: number;
  commandResult: number;
  msg: string;

  get isSuccess() {
    return this.commandResult === 0;
  }
}

export class StbResponse {
  status: StbStatus;
  key: string;
  hold: string;
}

export enum AvermediaCommandType {
  unknown = 0,
  power = 1,
  source = 2,

  d1 = 3,
  d2 = 4,
  d3 = 5,
  d4 = 6,
  d5 = 7,
  d6 = 8,
  d7 = 9,
  d8 = 10,
  d9 = 11,
  d0 = 12,

    /// <summary>
    /// Button to change selector from 1 digit to 2 digits _/__
    /// </summary>
  oneOrTen = 13,
  enter = 14,

  volUp = 15,
  volDown = 16,

  cnUp = 17,
  cnDown = 18,

  mute = 19,
  recall = 20,

  up = 21,
  down = 22,
  left = 23,
  right = 24,
  ok = 25,

  menu = 26,
  exit = 27,
  info = 28,
  guide = 29,

  rew = 30,
  pause = 31,
  play = 32,
  fwd = 33,

  prev = 34,
  stop = 35,
  rec = 36,
  next = 37,

  red = 38,
  green = 39,
  yellow = 40,
  blue = 41,

  f1 = 42,
  f2 = 43,
  f3 = 44,
  f4 = 45
}
// export enum AvermediaCommandType {
//   unknown = 0,
//   power = 1,
//   source = 2,
//
//   d1 = 3,
//   d2 = 4,
//   d3 = 5,
//   d4 = 6,
//   d5 = 7,
//   d6 = 8,
//   d7 = 9,
//   d8 = 10,
//   d9 = 11,
//
//   /// <summary>
//   /// Button to change selector from 1 digit to 2 digits _/__
//   /// </summary>
//   oneOrTen = 12,
//   d0 = 13,
//   enter = 14,
//
//   volUp = 15,
//   volDown = 16,
//
//   mute = 17,
//   refresh = 18,
//
//   cnUp = 19,
//   cnDown = 20,
//
//   up = 21,
//   down = 22,
//   left = 23,
//   right = 24,
//   ok = 25, // ?
//
//   menu = 26,
//   exit = 27,
//   info = 28,
//   guide = 29,
//
//   rew = 30,
//   pause = 31,
//   play = 32,
//   fwd = 33,
//
//   prev = 34,
//   stop = 35,
//   rec = 36,
//   next = 37,
//
//   red = 38,
//   green = 39,
//   yellow = 40,
//   blue = 41,
//
//   f1 = 42,
//   f2 = 43,
//   f3 = 44,
//   f4 = 45
// }

export interface AvermediaCommand {
  id: string;
  commandType: AvermediaCommandType;
  deviceType: StbType;
  irBlasterId?: number;
}

export interface AvermediaButtonAvailability {
  key: AvermediaCommandType;
  value: boolean;
}
;

export interface DirecTvSchedule {
  primaryImageUrl: string;
  gridViewPrimaryImageUrl: string;
  title: string;
  episodeNumber?: number;
  duration: number;
  airTime: string;
  listViewPrimaryImageUrl: string;
}

export interface DirecTvChannel {
  chNum: number;
  authCode: string;
  chRec: boolean;
  chHd: boolean;
  chId: number;
  chName: string;
  chKey: string;
  chDesc: string;
  chCall: string;
  detailsLinkUrl: string;
  chLogoId: number;
  schedules?: DirecTvSchedule[];
}

export interface DirecTvScheduleRequest {
  channels: DirecTvChannel[];
  hoursCount: number;
  startDate: string;
}

export interface DbRecording {
  id: string;
  deviceId: string;
  startTime: string;
  endTime: string;
  timestamp: string;
  channelNumber: number;
  deviceType: StbType;
}

export interface RecordingData {
  deviceId: string;
  recordings: DbRecording[];
}

export enum RemoteControlType {
  StbRemote,
  AvermediaRemote
}

export class EncodingParameters {
  gameId: string;
  mongoGameId: string;
  durationInHours: number;
  nodeIpAddress: string;
  stbId: string;
}

export class GameInfo {
  gameId: number;
  leagueName: string;
  gameName: string;
  date: string;
}

export class EncodingResult {
  gameId: string;
  jobId: string;
  assetId: string;
  currentStatus: string;
  duration: string;
  gameName: string;
  leagueName: string;
  gameDate: string;
}
