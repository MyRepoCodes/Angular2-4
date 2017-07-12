import { ContainersService } from '../containers.service';
import { Container } from '../containers.types';
export class DataCenterBinder {
  public static KEY_NAME = 'dataCenter';

  public dataCenters: any[];

  constructor(private containersService: ContainersService, private model: Container) {
    this.dataCenters = this.containersService.dataCenters.map(dc => {
      return {label: dc.name, value: dc.id};
    });
    this.dataCenters.unshift({label: 'Select Data Center', value: ''});
    if (!this.model.parent) {
      this.model.parent = {id: '', iid: 0};
    }
  }

  public get dataCenter() {
    return this.model.parent.id;
  }
}

export class ServerBinder {
  public static KEY_NAME = 'server';

  public servers: any[];

  private dataCenterInternal = '';

  constructor(private containersService: ContainersService, private model: Container) {
    if (!this.model.parent) {
      this.model.parent = {id: '', iid: 0};
    } else {
      const servers = containersService.servers.filter(s => s.id === model.parent.id);
      if (servers.length > 0) {
        this.dataCenterInternal = servers[0].parent.id;
      }
    }
    this.loadServers();
  }


  public set dataCenter(id: string) {
    this.dataCenterInternal = id;
    this.loadServers();
  }

  public get dataCenter() {
    return this.dataCenterInternal;
  }

  private loadServers() {
    this.servers = this.containersService.servers.filter(s => s.parent != null && s.parent.id === this.dataCenterInternal).map(dc => {
      return {label: dc.name, value: dc.id};
    });
    this.servers.unshift({label: 'Select Server', value: ''});
  }

  public get server() {
    return this.model.parent.id;
  }
}
