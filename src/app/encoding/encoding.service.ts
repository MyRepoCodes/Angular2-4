import { EncodingState } from './encoding.state';
import { EncodingApiService } from './api.service';
import { EncodingAPIUrls } from './api.urls';
import { EncodingActions } from './encoding.actions';
import { Injectable } from '@angular/core';
import { EncodingRoutingConstants } from './routes/encoding.route';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api/api.service';
import { RequestOptions } from '@angular/http';
import { API_GAMES_URL } from '../shared/api/api.urls';
import { EncodingParameters } from './encoding.entity';
import { NotificationService } from '../shared/services/notification.service';

interface IServiceDispatchObject {
  type: EncodingActions;
  payload: any;
};

@Injectable()
export class EncodingService {
  public state: EncodingState;

  constructor(private encodingApiService: EncodingApiService,
              private apiService: ApiService, private router: Router,
              private notificationService: NotificationService) {
    this.state = new EncodingState();
  }

  public dispatch(data: IServiceDispatchObject) {
    this.state.dispatch(data.type, data.payload);
  }

  public loadStbList(force = false) {
    const url = EncodingAPIUrls.API_STB_LIST;
    const data = this.encodingApiService.getEntities(url);
    data.subscribe(response => {
      this.dispatch({ type: EncodingActions.STB_LIST_LOADED, payload: response });
      if (response.length > 0) {
        this.dispatch({ type: EncodingActions.SELECTED_STB_CHANGED, payload: response[0] });
      }
    }, error => {
      this.notificationService.showError('Couldn\'t load list of STB devices');
    });
  }

  public loadEncodingNodesList() {
    this.encodingApiService.getEntities(EncodingAPIUrls.getLoadEncodingNodesListUrl()).subscribe(response => {
      this.dispatch({ type: EncodingActions.ENCODING_NODES_LIST_LOADED, payload: response});
    },
    error => {
      this.notificationService.showError('Couldn\'t load list of encoding nodes');
    });
  }

  public goToSpecificStb(id: string) {
    const url = EncodingRoutingConstants.PREFIX + '/' + EncodingRoutingConstants.PLAYER + '/' + id;
    this.router.navigateByUrl(url);
  }

  public loadGameInfo(gameId: string) {
    const options: RequestOptions = new RequestOptions({
      url: API_GAMES_URL + '/search?iid=' + gameId,
      method: 'GET'
    });
    this.apiService.request(options).subscribe(response => {
      this.dispatch({type: EncodingActions.GAME_INFO_LOADED, payload: response});
    });
  }

  public startEncoding(data: EncodingParameters) {
    this.encodingApiService.postEntity(EncodingAPIUrls.getBeginEncodingUrl(), data).subscribe(response => {
      this.dispatch({type: EncodingActions.ENCODING_STARTED, payload: response});
    });
  }

  public cancelEncoding(jobId: string) {
    this.encodingApiService.deleteEntity(EncodingAPIUrls.getBeginEncodingUrl(), jobId).subscribe(response => {

    });
  }
}
