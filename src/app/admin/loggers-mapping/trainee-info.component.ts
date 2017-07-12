import { Component, Input } from '@angular/core';
import { TrainingInfo } from './entities';

@Component({
  selector: 'sn-trainee-info-form',
  templateUrl: 'trainee-info.component.html'
})
export class TraineeInfoComponent {

  @Input() model: TrainingInfo;

  constructor() {
  }
}
