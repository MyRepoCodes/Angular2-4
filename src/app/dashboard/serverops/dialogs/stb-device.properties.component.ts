import { Component, Input, OnInit } from '@angular/core';
import { StbDevice, StbDeviceType } from '../containers.types';
import { DataCenterBinder } from './DataCenter.binder';
import { ContainersService } from '../containers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sn-stb-device-properties-component',
  template: `
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Data Center *:
        </div>
        <div class="ui-g-4">
          <p-dropdown [options]="binder.dataCenters" [ngModel]="binder.dataCenter"
           [formControl]="form.controls.dataCenter" [style]="{'width':'168px'}"></p-dropdown>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.dataCenter.valid && form.controls.dataCenter.dirty">
            <i class="fa fa-close"></i> Data Center is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          STB Device Type *:
        </div>
        <div class="ui-g-4">
          <p-dropdown [options]="stbDeviceTypes" [ngModel]="model.type"
           [formControl]="form.controls.type" [style]="{'width':'168px'}"></p-dropdown>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.type.valid && form.controls.type.dirty">
            <i class="fa fa-close"></i> STB Device Type is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Avermedia Name *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.avermediaName" [formControl]="form.controls.avermediaName" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.avermediaName.valid && form.controls.avermediaName.dirty">
            <i class="fa fa-close"></i> Avermedia Name is required
          </div>
        </div>
      </div>

      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Device Host *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.deviceHost" [formControl]="form.controls.deviceHost" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.deviceHost.valid && form.controls.deviceHost.dirty">
            <i class="fa fa-close"></i> Device Host is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Encoder Host *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.encoderHost" [formControl]="form.controls.encoderHost" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.encoderHost.valid && form.controls.encoderHost.dirty">
            <i class="fa fa-close"></i> Encoder Host is required
          </div>
        </div>
      </div>
  `
})
export class StbDevicePropertiesComponent implements OnInit {
  @Input()
  public model: StbDevice;
  @Input()
  public formContainer: FormGroup[];

  public stbDeviceTypes: any[];

  public form: FormGroup;

  public binder: DataCenterBinder;

  constructor(private containersService: ContainersService, private formBuilder: FormBuilder) {
    this.stbDeviceTypes = [
      {label: 'Select Type', value: ''},
      {label: 'DirecTv', value: StbDeviceType.DirecTv},
      {label: 'Roku', value: StbDeviceType.Roku},
      {label: 'Dish', value: StbDeviceType.Dish}
    ];
  }

  ngOnInit(): void {
    this.binder = new DataCenterBinder(this.containersService, this.model);
    this.form = this.formBuilder.group({
      dataCenter: ['', Validators.required],
      type: ['', Validators.required],
      avermediaName: ['', Validators.required],
      deviceHost: ['', Validators.required],
      encoderHost: ['', Validators.required]
    });
    this.formContainer.push(this.form);
  }
}
