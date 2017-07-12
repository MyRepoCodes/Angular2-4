import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TOKEN_SERVICE, TokenService } from './token.service';
import { ApiService } from '../shared/api/api.service';
import { User } from './user.models';

@Injectable()
export class AuthService {
  private static USER_LOGIN_URL = '/security/api/session/login';
  private static USER_ME_URL = '/security/api/users/getMe';
  private static SITE = 'serverweb';
  private user: User;
  public redirectUrl;

  constructor(
    @Inject(TOKEN_SERVICE) private _tokenService: TokenService,
    private api: ApiService
  ) {
  }

  public currentUser(): User {
    return this.user;
  }

  public logout() {
    this._tokenService.removeToken();
    console.log('token removed');
    return Observable.of(true);
  }

  public login(username: string, password: string): Observable<boolean> {
    const loginInfo = { username: username, password: password, site: AuthService.SITE };
    return this.api.postEntity(AuthService.USER_LOGIN_URL, loginInfo)
      .switchMap(res => {
        if (res.success) {
          this._tokenService.setToken(res.accessToken.token);
          return this.api.searchEntities(AuthService.USER_ME_URL)
            .switchMap(result => {
              this.user = this.mapToUser(result.result);
              return Observable.of(true);
            })
            .catch(err => {
              return Observable.of(false);
            });
        }

        return Observable.of(false);
      })
      .catch(err => Observable.of(false));
  }

  public isLogged(): boolean {
    return this._tokenService.isTokenPresent();
  }

  public initialize(): Promise<any> {
    if (!this.isLogged()) {
      return Promise.resolve();
    }

    const promise = this.api.searchEntities(AuthService.USER_ME_URL).toPromise();

    const result = new Promise((resolve, reject) => {
      promise.then(res => {
        this.user = this.mapToUser(res.result);
        resolve(true);
      }).catch(() => {
        console.log('Cannot load user.');
        this._tokenService.removeToken();
        resolve(true);
      });
    });

    return result;
  }

  private mapToUser(data: any): User {
    const user = new User(data);
    console.log('Current user: ' + user.id);
    return user;
  }
}
