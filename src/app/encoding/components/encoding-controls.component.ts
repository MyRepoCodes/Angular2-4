import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter } from '@angular/core';
import { RemoteControlButtonAction, CommandAction, CommandType, StbDevice } from '../encoding.entity';
import { NotificationService } from '../../shared/services/notification.service';
import { StbDeviceType } from '../../dashboard/serverops/containers.types';

@Component({
  selector: 'sn-encoding-controls',
  templateUrl: './encoding-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodingControlsComponent {
  @Output() public buttonClicked = new EventEmitter(true);
  @Output() public sequenceRequested = new EventEmitter(true);

  directTvControlImg = 'assets/images/Encoding/DirecTv/Control.png';
  rocuRemoteControlImg = 'assets/images/Encoding/Roku/roku-remote-control-small.png';

  public deviceTypes = StbDeviceType;

  textInput = '';

  public selectedType = 'Unknown';

  constructor(public notificationService: NotificationService) {

  }

  @Input()
  public set selectedStb(value: StbDevice) {
    if (!value) {
      return;
    }

    this.selectedType = value.type.toString();
  }

  public onDirecTvButtonClicked(command: string) {
    this.buttonClickedInternal(command, 'DirecTv');
    return false;
  }

  public onRokuButtonClicked(command: string) {
    this.buttonClickedInternal(command, 'Roku');
    return false;
  }

  public rokuText() {
    const commands = [];
    while (this.textInput.length > 0) {
      let letter = this.textInput.slice(0, 1);

      // Handle the few characters Roku needs encoded beyond escape();
      switch (letter) {
        case '/':
          letter = '%2f';
          break;

        case '@':
          letter = '%40';
          break;

        case '+':
          letter = '%2b';
          break;

        default:
          letter = encodeURIComponent(letter);
          break;
      }
      letter = 'LIT_' + letter;

      const button = new RemoteControlButtonAction();
      button.action = CommandAction.KeyPress;
      button.type = CommandType.Raw;
      button.stbType = 'Roku';
      button.rawValue = letter;
      commands.push(button);
      this.textInput = this.textInput.slice(1);
    }

    if (commands.length > 0) {
      this.sequenceRequested.emit(commands);
    }
  }

  private buttonClickedInternal(command: string, deviceType: string) {
    console.log(deviceType + ' button clicked: ' + command);

    const button = new RemoteControlButtonAction();
    button.action = CommandAction.KeyPress;
    button.type = CommandType[command];
    button.stbType = deviceType;

    this.buttonClicked.emit(button);
  }
}


