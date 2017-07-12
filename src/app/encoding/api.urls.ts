import { StbType } from './encoding.entity';

export class EncodingAPIUrls {
  static API_STB_LIST = '/devices';
  static API_REMOTE_CONTROL_COMMANDS = '/devices/';
  static API_AVERMEDIA_COMMANDS = '/avermedia';

  static REMOVE_RECORD_URL = '/recordings/';

  static getChannelsUrl(deviceType: StbType) {
    return '/schedule/' + StbType[deviceType] + '/channels';
  }

  static getScheduleUrl(deviceType: StbType) {
    return '/schedule/' + StbType[deviceType];
  }

  static getEncodeShowUrl(deviceType: StbType) {
    return '/encode/' + StbType[deviceType];
  }

  static getEncodeRecordUrl(recordId: string) {
    return '/encode/recording/' + recordId;
  }

  static getRecordShowUrl(deviceType: StbType, deviceId: string) {
    return '/recordings/' + StbType[deviceType] + '/' + deviceId;
  }

  static getDeviceRecordingsUrl(deviceId: string) {
    return '/recordings/' + deviceId;
  }

  static getLoadEncodingNodesListUrl() {
    return '/encode/nodes';
  }

  static getBeginEncodingUrl() {
    return '/encode';
  }

  static getGameInfoUrl() {
    return '/encode/game';
  }

  // static getDeleteRecordUrl(deviceId: string) {
  //   return '/recordings/' + deviceId;
  // }
}
