import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { StbDevice } from '../encoding.entity';

@Component({
  selector: 'sn-encoding-schedule-dialog',
  template: `
    <p-dialog [header]="vm.selectedSchedule?.title" modal="modal"
              [(visible)]="vm.isScheduleDialogVisible" showEffect="fade">
      <span>Would you like to record this show?</span>
      <div>Select Encoding stream:
        <select [(ngModel)]="selectedItem">
          <option [ngValue]="item" *ngFor="let item of items">{{ item.name }}</option>
        </select>
      </div>
      <footer>
        <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">          
          <button type="button" pButton icon="fa-close" 
                 (click)="vm.hideScheduleDialog()" 
                  label="No"></button>
          <button type="button" pButton icon="fa-check" 
                 (click)="vm.encodeShow(vm.selectedChannel, vm.selectedSchedule)"
                  label="Encode show"></button>
          <button type="button" pButton icon="fa-check" 
                 (click)="vm.recordShow(vm.selectedChannel, vm.selectedSchedule)"
                  label="Record show"></button>
        </div>
      </footer>
    </p-dialog> 



  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodingScheduleDialogComponent {
  @Input()
  public isVisible: boolean;

  vm;

  @Input() public selectedDevice: StbDevice;
  @Input() public items;
  @Output() public onStbSelected = new EventEmitter(true);

  public set selectedItem(value) {
    this.onStbSelected.emit(value);
  }

  public get selectedItem() {
    return this.selectedDevice;
  }
}


