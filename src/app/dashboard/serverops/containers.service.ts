import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../shared/api/api.service';
import { API_CONTAINERS_URL } from '../../shared/api/api.urls';
import {
  ContainerType, Container, DataCenter, Server,
} from './containers.types';
import { NotificationService } from '../../shared/services/notification.service';


@Injectable()
export class ContainersService {
  enabled = 'Enabled';
  disabled = 'Disabled';

  // public containers;
  public dataCenters: DataCenter[];

  public servers: Server[];

  constructor(private api: ApiService, private notificationService: NotificationService) {
  }

  public getContainers(): Observable<Container[]> {
    const observable = this.api.searchEntities(API_CONTAINERS_URL).map(r => r.result).catch(err => {
      this.notificationService.showError('Couldn\'t load containers');
      return Observable.empty();
    });

    observable.subscribe((containers: Container[]) => {
      this.dataCenters = [];
      this.servers = [];
      for (const container of containers) {
        const type = this.getType(container as Container);
        switch (type) {
          case ContainerType.DataCenter:
            this.dataCenters.push(container as DataCenter);
            break;

          case ContainerType.Server:
            this.servers.push(container as Server);
            break;
        }
      }
    });

    return observable;
  }

  public getType(container: Container): ContainerType {
    if (this.contains(container, 'server')) {
      return ContainerType.Server;
    }
    if (this.contains(container, 'datacenter')) {
      return ContainerType.DataCenter;
    }
    if (this.contains(container, 'jobhandler')) {
      return ContainerType.JobHandler;
    }
    if (this.contains(container, 'stbdevice')) {
      return ContainerType.StbDevice;
    }
    if (this.contains(container, 'serverasset')) {
      return ContainerType.ServerAsset;
    }

    return ContainerType.Unknown;
  }

    public generateScaffolding(type: ContainerType): Container {
    switch (type) {
      case ContainerType.DataCenter:
        return {'$type': 'Synergy.Model.Api.Operations.Containers.DataCenter, Synergy.Model.Api'} as Container;
      case ContainerType.Server:
        return {'$type': 'Synergy.Model.Api.Operations.Containers.Server, Synergy.Model.Api'} as Container;
      case ContainerType.JobHandler:
        return {'$type': 'Synergy.Model.Api.Operations.Containers.JobHandler, Synergy.Model.Api'} as Container;
      case ContainerType.StbDevice:
        return {'$type': 'Synergy.Model.Api.Operations.Containers.StbDevice, Synergy.Model.Api'} as Container;
      case ContainerType.ServerAsset:
        return {'$type': 'Synergy.Model.Api.Operations.Containers.ServerAsset, Synergy.Model.Api'} as Container;
    }
    throw new Error('Unknown type of container');
  }

  public create(container: Container) {
    return this.api.postEntity(API_CONTAINERS_URL, container);
  }

  public update(container: Container) {
    return this.api.putEntity(API_CONTAINERS_URL, container.id, container);
  }

  public delete(container: Container): Observable<any[]> {
    return this.api.deleteEntity(API_CONTAINERS_URL, container.id);
  }

  private contains(container: Container, match: string): boolean {
    if (!container || !container.$type) {
      return false;
    }
    return container.$type.toLowerCase().indexOf('.' + match + ',') > -1;
  }
}

