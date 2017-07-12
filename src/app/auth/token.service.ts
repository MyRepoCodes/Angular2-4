import { Injectable, OpaqueToken } from '@angular/core';
import { Cookie } from './cookie';

const TOKEN_KEY = 'serverweb';
const YEAR = 365;

export abstract class TokenService {
  abstract getToken(): string;
  abstract setToken(token: string);
  abstract removeToken(): void;
  abstract isTokenPresent(): boolean;
}

@Injectable()
export class CookieTokenService extends TokenService {
  getToken(): string {
    return Cookie.get(TOKEN_KEY);
  }

  setToken(token: string) {
    Cookie.set(TOKEN_KEY, token, YEAR);
  }

  removeToken(): void {
    Cookie.delete(TOKEN_KEY);
  }

  isTokenPresent(): boolean {
    return Cookie.check(TOKEN_KEY);
  }
}

export const TOKEN_SERVICE = new OpaqueToken('TOKEN_SERVICE');
export const TOKEN_PROVIDERS = [
  { provide: TOKEN_SERVICE, useClass: CookieTokenService }
];

