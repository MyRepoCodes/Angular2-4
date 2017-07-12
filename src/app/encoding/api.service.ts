import { Injectable, Inject } from '@angular/core';
import { RequestOptions, RequestMethod, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../shared/api/api.service';
import { TOKEN_SERVICE, TokenService } from '../auth/token.service';
import { AppSettingsService } from '../shared/app-settings.service';
// import { AppSettingsService } from '../../shared';

@Injectable()
export class EncodingApiService extends ApiService {
  constructor(
    @Inject(TOKEN_SERVICE) tokenService: TokenService,
    settings: AppSettingsService,
    http: Http
  ) {
    super(tokenService, settings, http);
  }

  protected getUrl(relativeUrl: string) {
    return this.settings.getEncodingBaseUrl() + relativeUrl;
  }

  getEntities(url: string): Observable<any> {
    return this.request(new RequestOptions({
      method: RequestMethod.Get,
      url: url
    }));
  }
}
