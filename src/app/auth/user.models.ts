
import { Scopes } from './scopes';
export interface IUserRef {
  iid: number;
  id: string;
  first: string;
  last: string;
  username: string;
}

export class UserRef implements IUserRef {
  iid: number;
  id: string;
  first: string;
  last: string;
  username: string;

  constructor(user: User) {
    this.iid = user.iid;
    this.first = user.first;
    this.last = user.last;
    this.username = user.username;
    this.id = user.id;
  }
}

export interface ITeam {
  id: string;
  iid: number;
  name: string;
  abbreviation: string;
}
export interface IPermissionRef {
  id: string;
  iid: number;
}
export interface IPermission {
  permission: IPermissionRef;
  available: boolean;
  visible: boolean;
}
export interface ILoggingGroup {
  id: string;
  iid: number;
  type: number;
  name: string;
}
export interface IGroupRef {
  id: string;
  iid: number;
}
export interface ILeague {
  id: string;
  iid: number;
  name: string;
  abbreviation: string;
}

export class User {
  id: string;
  iid: number;
  username: string;
  last: string;
  first: string;
  email: string;
  type: number;
  timezone: number;
  admin: boolean;
  role: string;
  scopes: string[];

  constructor(data: any) {
    this.id = data.id;
    this.iid = data.iid;
    this.username = data.username;
    this.last = data.last;
    this.first = data.first;
    this.email = data.email;
    this.type = data.type;
    this.timezone = data.timezone;
    this.admin = data.admin;
    this.role = data.role;
    this.scopes = data.scope;
  }

  public isInRole(roles: string[] | string) {
    let tmp: any = roles;
    if (roles instanceof String) {
     tmp = [roles];
    }

    const matchedRoles = tmp.filter(role => this.scopes.indexOf(role) >= 0);
    return matchedRoles.length > 0;
  }

  public get isAdmin() {
    return this.scopes.indexOf(Scopes.SilverOpsAdmin) >= 0;
  }
}
