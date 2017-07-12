import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { StbDevice, RemoteControlType } from '../encoding.entity';

@Component({
  selector: 'sn-directv-stream-selector',
  template: `
  <div class="ui-g">
    <div class="ui-g-6">Select video stream:<br/>
      <p-dropdown [style]="{'width':'168px'}" [options]="preparedDevices" [ngModel]="selectedDevice?.id"
                  [autoWidth]="false" (onChange)="onDeviceChanged($event)"></p-dropdown>
    </div>
    <div *ngIf="showRemoteControlSelector" class="ui-g-6">
      Active remote control: <br/>
      <p-dropdown [style]="{'width':'168px'}" [options]="remoteControls" [ngModel]="selectedRemoteControl" 
                  [autoWidth]="false" (onChange)="onSelectedRemoteControlChanged($event)"></p-dropdown>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodingStreamSelectorComponent {
  @Input() public selectedDevice: StbDevice;
  @Output() public onStbSelected = new EventEmitter(true);

  @Input() public selectedRemoteControl: RemoteControlType;
  @Output() public selectedRemoteControlChange = new EventEmitter(true);

  @Input() public showRemoteControlSelector = false;

  public preparedDevices: any[];
  private devicesHash = {};

  public remoteControls = [
                            { label: 'Device remote control', value: RemoteControlType.StbRemote },
                            { label: 'Avermedia remote control', value: RemoteControlType.AvermediaRemote }
                           ];

  @Input()
  public set availableDevices(value: StbDevice[]) {
    if (value) {
      this.preparedDevices = [];
      const devices = value.sort((n1, n2) => {
        if (n1.name > n2.name) {
          return 1;
        }

        if (n1.name < n2.name) {
          return -1;
        }

        return 0;
      });
      for (const item of devices) {
        this.devicesHash[item.id] = item;
        this.preparedDevices.push({ label: item.name, value: item.id });
      }
    }
  }

  public onDeviceChanged(event) {
    const device = this.devicesHash[event.value];
    this.selectedDevice = device;
    this.onStbSelected.emit(device);
  }

  public onSelectedRemoteControlChanged(event) {
    this.selectedRemoteControlChange.emit(event.value);
  }
}


