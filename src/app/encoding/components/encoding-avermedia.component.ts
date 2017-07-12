import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { AvermediaCommandType, StbDevice } from '../encoding.entity';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'sn-avermedia-controls',
  templateUrl: './encoding-avermedia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvermediaControlsComponent {
  @Output() public buttonClicked = new EventEmitter(true);

  @Input()
  public availableAvermediaButtons: any = true;

  remoteControlImg = 'assets/images/Encoding/Avermedia/remote-control.png';

  private selectedType = 'Unknown';

  constructor(private notificationService: NotificationService) {

  }

  @Input()
  public set selectedStb(value: StbDevice) {
    if (!value) {
      return;
    }

    this.selectedType = value.type.toString();
  }

  public onButtonClicked(command: string) {
    if (!this.availableAvermediaButtons) {
        this.notificationService.showWarn('Please select STB device before using remote control');
      return;
    }

    const type: AvermediaCommandType = AvermediaCommandType[command];
    const isAvailable = this.availableAvermediaButtons[command.toLowerCase()];
    if (this.availableAvermediaButtons && isAvailable === false) {
      let message = '';
      for (const prop in this.availableAvermediaButtons) {
        if (this.availableAvermediaButtons[prop] === true) {
          message += prop + '\n';
        }
      }
      this.notificationService.showWarn('Button ' + type + ' isn\'t avaialable on this device. Available buttons are:\n' + message);
      return;
    }

    this.buttonClicked.emit(type);
    return false;
  }
}


