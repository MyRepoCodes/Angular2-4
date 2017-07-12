import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { EncodingScheduleComponent } from '../containers/encoding-schedule.container';
import { EncodingRecordingsComponent } from '../containers/recordings.container';
import { EncodingPlayerRouteComponent } from './EncodingPlayerRoute';

export class EncodingRoutingConstants {
  static PLAYER_WITH_ID = 'player/:deviceId';
  static PLAYER = 'player';
  static SCHEDULE = 'schedule';
  static RECORDINGS = 'recordings';
  static PREFIX = '/encoding';
}

export const encodingRoutes: Routes = [
  { path: EncodingRoutingConstants.PLAYER_WITH_ID, component: EncodingPlayerRouteComponent },
  { path: EncodingRoutingConstants.PLAYER, component: EncodingPlayerRouteComponent },
  { path: EncodingRoutingConstants.SCHEDULE, component: EncodingScheduleComponent },
  { path: EncodingRoutingConstants.RECORDINGS, component: EncodingRecordingsComponent },
  { path: '', redirectTo: 'schedule', pathMatch: 'full' }
];

@Component({
  template: `<router-outlet></router-outlet>`
})
export class EncodingRouterComponent {
}
