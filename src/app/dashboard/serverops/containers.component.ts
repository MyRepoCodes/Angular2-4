import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import {
  ContainerType, Container, Server, JobHandler, StbDevice, DataCenter, ServerAsset,
  StbDeviceType
} from './containers.types';
import { ContainersService } from './containers.service';
import { ContainerDialogComponent, EditMode } from './container.dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { JobHandlerType } from '../../sport/games/job.entity';

@Component({
  selector: 'sn-containers-component',
  templateUrl: './containers.component.html'
})
export class ContainersComponent implements OnInit {

  @ViewChild('containerDialog')
  public containerDialog: ContainerDialogComponent;

  container;
  message;
  public containers;
  public filteredContainers;

  public filterValues: any[];
  public filterValue: ContainerType = ContainerType.Unknown;

  public types = ContainerType;
  public jobHandlerTypes = JobHandlerType;
  public stbTypes = StbDeviceType;

  constructor(private containersService: ContainersService,
              private confirmationService: ConfirmationService,
              private notificationService: NotificationService) {
    this.filterValues = [
      {label: 'All containers', value: ContainerType.Unknown},
      {label: 'Data Centers', value: ContainerType.DataCenter},
      {label: 'Servers', value: ContainerType.Server},
      {label: 'Stb Devices', value: ContainerType.StbDevice},
      {label: 'Job Handlers', value: ContainerType.JobHandler},
      {label: 'Server Assets', value: ContainerType.ServerAsset}
    ];
  }

  nodeUnselect(v) {}

  ngOnInit() {
    this.loadContainers();
  };

  loadContainers = () => {
    this.containersService.getContainers().subscribe((containers: Container[]) => {
     this.containers = containers;
     this.onFilterSelected({});
    });
  }

  onFilterSelected(v) {
    let result;
    if (this.filterValue === ContainerType.Unknown || !this.containers) {
      result = this.containers;
    } else {
      result = this.containers.filter((container: Container) => {
        const type = this.containersService.getType(container);
        return type === this.filterValue;
      });
    }
    this.filteredContainers = result.map(c => this.convert(c));
  };

  public save(data) {
    if (data.mode === EditMode.create) {
      this.containersService.create(data.model).subscribe(result => {
        this.notificationService.showInfo('Container created');
        this.loadContainers();
      }, error => {
        this.notificationService.showError('Couldn\'t create container: ' + error);
      });
    }
    if (data.mode === EditMode.edit) {
      this.containersService.update(data.model).subscribe(result => {
        this.notificationService.showInfo('Container updated');
        this.loadContainers();
      }, error => {
        this.notificationService.showError('Couldn\'t update container: ' + error);
      });
    }
  }

  private delete(container: Container) {
    this.containersService.delete(container).subscribe(result => {
      this.notificationService.showInfo('Container deleted');
      this.loadContainers();
    }, error => {
      this.notificationService.showError('Couldn\'t delete container: ' + error);
    });

  };

  onRowSelect = (event) => {
    console.log(event);
    this.containerDialog.showDialog(event.data.container as Container, EditMode.edit);
  }

  public addDataCenter() {
    this.containerDialog.showDialog(this.containersService.generateScaffolding(ContainerType.DataCenter), EditMode.create);
  }

  public addServer() {
    this.containerDialog.showDialog(this.containersService.generateScaffolding(ContainerType.Server), EditMode.create);
  }

  public addJobHandler() {
    this.containerDialog.showDialog(this.containersService.generateScaffolding(ContainerType.JobHandler), EditMode.create);
  }

  public addStbDevice() {
    this.containerDialog.showDialog(this.containersService.generateScaffolding(ContainerType.StbDevice), EditMode.create);
  }

  public addServerAsset() {
    this.containerDialog.showDialog(this.containersService.generateScaffolding(ContainerType.ServerAsset), EditMode.create);
  }

  public confirmDelete(data) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this container?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.delete(data.model as Container);
      }
    });
  }

  private convert(container: Container): Object {
    const type = this.containersService.getType(container);
    switch (type) {
      case ContainerType.Server:
        const server: Server = container as Server;
        return {
            id: server.id,
            name: server.name,
            containerType: 'Server',
            type: ContainerType.Server,
            active: server.active ? true : false,
            enabled: server.enabled ? true : false,
            container: server,
        };
      case ContainerType.DataCenter:
        const dataCenter: DataCenter = container as DataCenter;
        return {
            id: dataCenter.id,
            name: dataCenter.name,
            containerType: 'DataCenter',
            type: ContainerType.DataCenter,
            active: dataCenter.active ? true : false,
            enabled: dataCenter.enabled ? true : false,
            container: dataCenter,
        };

      case ContainerType.JobHandler:
        const jobHandler: JobHandler = container as JobHandler;
        return {
            id: jobHandler.id,
            name: jobHandler.name,
            containerType: 'JobHandler',
            type: ContainerType.JobHandler,
            active: jobHandler.active ? true : false,
            enabled: jobHandler.enabled ? true : false,
            container: jobHandler,
        };

      case ContainerType.StbDevice:
        const stbDevice: StbDevice = container as StbDevice;
        return {
          id: stbDevice.id,
          name: stbDevice.name,
          containerType: 'StbDevice',
          type: ContainerType.StbDevice,
          active: stbDevice.active ? true : false,
          enabled: stbDevice.enabled ? true : false,
          container: stbDevice,
        };

      case ContainerType.ServerAsset:
        const serverAsset: ServerAsset = container as ServerAsset;
        return {
          id: serverAsset.id,
          name: serverAsset.name,
          containerType: 'ServerAsset',
          type: ContainerType.ServerAsset,
          active: serverAsset.active ? true : false,
          enabled: serverAsset.enabled ? true : false,
          container: serverAsset,
        };
    }
  }
}
