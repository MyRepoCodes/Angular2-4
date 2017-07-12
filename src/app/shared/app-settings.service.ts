import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService {
  public getBaseUrl(): string {
    return environment.baseUrl;
  }

  public videoBaseUrl(): string {
    if (environment.baseUrl.includes('/production')) {
      return environment.baseUrl.replace('/production', '');
    }
    return environment.baseUrl;
  }

  public getLoginUrl(locationHref: string): string {
    return environment.loginUrl + locationHref;
  }

  public getTicketingBaseUrl(): string {
    return environment.ticketUrl;
  }

  public getEncodingBaseUrl(): string {
    return environment.encodingUrl;
  }
}

export const SETTINGS_PROVIDERS = [
  { provide: AppSettingsService, useClass: AppSettingsService }
];
