import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable, Inject } from '@angular/core';
import {
  Http, Headers,
  Request, RequestOptions, RequestMethod,
  URLSearchParams,
  Response
} from '@angular/http';
import { TokenService, TOKEN_SERVICE } from '../../auth/token.service';
import { Observable } from 'rxjs/Observable';
import { AppSettingsService } from '../app-settings.service';

@Injectable()
export class ApiService {
  static stringify(data: any) {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  }

  constructor(
    @Inject(TOKEN_SERVICE) private tokenService: TokenService,
    protected settings: AppSettingsService,
    private http: Http
  ) {
  }

  searchEntities(url: string, search?: Map<string, string>, acceptType = 'application/json'): Observable<any> {
    const searchParams: URLSearchParams = new URLSearchParams();
    if (search) {
      search.forEach((value, name) => searchParams.set(name, value));
    }

    return this.request(new RequestOptions({
      method: RequestMethod.Get,
      search: searchParams,
      url: url
    }), acceptType);
  }

  getEntityById(url: string, id: string): Observable<any> {
    id = this.parseId(id);
    return this.request(new RequestOptions({
      method: RequestMethod.Get,
      url: url + '/' + id
    }));
  }

  postEntity(url: string, payload: any): Observable<any> {
    return this.request(new RequestOptions({
      body: ApiService.stringify(payload),
      method: RequestMethod.Post,
      url: url
    }));
  }

  putEntity(url: string, id: string, payload: any): Observable<any> {
    id = this.parseId(id);
    return this.request(new RequestOptions({
      body: ApiService.stringify(payload),
      method: RequestMethod.Put,
      url: url
    }));
  }

  deleteEntity(url: string, id: string) {
    id = this.parseId(id);
    return this.request(new RequestOptions({
      method: RequestMethod.Delete,
      url: url + '/' + id
    }));
  }

  request(options: RequestOptions, acceptType = 'application/json'): Observable<any> {
    options.headers = new Headers({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
    if (options.body) {
      options.headers.append('Content-Type', 'application/json');
    }
    options.headers.append('Accept', acceptType); // this line need to firefox works properly
    options.url = this.getUrl(options.url);
    const request = new Request(options);
    console.log(request);
    return this.http.request(request)
      .map((res: Response) => {
        if (options.method === RequestMethod.Get && res.text()) {
          if (res.headers.get('Content-Type') === 'text/csv') {
            return res.text();
          }
          return res.json();
        } else {
          if (res.status === 201 || res.status === 204) { // created
            return res.text();
          }
          return res.json();
        }
      })
      .catch((err: any) => Observable.throw(err));
  }

  protected parseId(id: any): string {
    // if (!id) {
    //   throw new Error('id shouldn\'t be null');
    // }
    if (!id) {
      return '';
    }
    if ((typeof (id)).toLowerCase() === 'string') {
      return id;
    }
    if (id.result && (typeof (id.result)).toLowerCase() === 'string') {
      return id.result;
    }
    throw new Error('id should be string or has property "result" with correct id');
  }

  protected getUrl(relativeUrl: string) {
    return this.settings.getBaseUrl() + relativeUrl;
  }
}
