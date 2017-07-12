import { Injectable, Inject } from '@angular/core';
import {
  Http, RequestOptions, RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../shared/api/api.service';
import { TOKEN_SERVICE, TokenService } from '../../auth/token.service';
import { AppSettingsService } from '../../shared/app-settings.service';
@Injectable()
export class ApiTicketService extends ApiService {
  constructor(
    @Inject(TOKEN_SERVICE)  tokenService: TokenService,
    settings: AppSettingsService,
    http: Http
  ) {
    super(tokenService, settings, http);
  }

  protected getUrl(relativeUrl: string) {
    return this.settings.getTicketingBaseUrl() + relativeUrl;
  }

  putEntity(url: string, id: string, payload: any): Observable<any> {
    return this.request(new RequestOptions({
      body: ApiService.stringify(payload),
      method: RequestMethod.Put,
      url: url + '/' + id
    }));
  }
  getEntity(url: string, payload: any): Observable<any> {
    return this.request(new RequestOptions({
      body: ApiService.stringify(payload),
      method: RequestMethod.Get,
      url: url
    }));
  }

}
