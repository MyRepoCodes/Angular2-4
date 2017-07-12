import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable()
export class SecurityHttpService {

  private static USERS_URL = '/Security/api/users';

  private static usersSearchByTextUrl = (searchText) => `${SecurityHttpService.USERS_URL}/search/${searchText}`;
  private static usersSearchByIidUrl = (iid) => `${SecurityHttpService.USERS_URL}/${iid}`;

  constructor(private api: ApiService) {
  }

  loadUser(id) {
    return this.api.getEntityById(SecurityHttpService.USERS_URL, id);
  }

  searchUserByText(searchText, userType = null) {
    const params = new Map<string, string>();
    if (userType !== null) {
      params.set('userType', userType);
    }
    return this.api.searchEntities(SecurityHttpService.usersSearchByTextUrl(searchText), params);
  }

  searchUserByIid(iid, userType) {
    const params = new Map<string, string>();
    params.set('userType', userType);
    return this.api.searchEntities(SecurityHttpService.usersSearchByIidUrl(iid), params);
  }
}
