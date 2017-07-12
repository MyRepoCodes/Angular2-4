import { Component, Input, OnInit } from '@angular/core';
import { ServerAsset } from '../containers.types';
import { ContainersService } from '../containers.service';
import { DataCenterBinder } from './DataCenter.binder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sn-server-asset-properties-component',
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
          Domain *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.domain" [formControl]="form.controls.domain" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.domain.valid && form.controls.domain.dirty">
            <i class="fa fa-close"></i> Domain is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          IP *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.ip" [formControl]="form.controls.ip" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.ip.valid && form.controls.ip.dirty">
            <i class="fa fa-close"></i> IP is required
          </div>
        </div>
      </div>
      
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Internal IP *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.ipInternal" [formControl]="form.controls.ipInternal" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.ipInternal.valid && form.controls.ipInternal.dirty">
            <i class="fa fa-close"></i> Internal IP is required
          </div>
        </div>
      </div>
      
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Domain *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.domain" [formControl]="form.controls.domain" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.domain.valid && form.controls.domain.dirty">
            <i class="fa fa-close"></i> Domain is required
          </div>
        </div>
      </div>

      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          ODS Id *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.odsId" [formControl]="form.controls.odsId" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.odsId.valid && form.controls.odsId.dirty">
            <i class="fa fa-close"></i> ODS Id is required
          </div>
        </div>
      </div>
      
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          ODS Version *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.odsVersion" [formControl]="form.controls.odsVersion" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.odsVersion.valid && form.controls.odsVersion.dirty">
            <i class="fa fa-close"></i> ODS Version is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Machine Pool *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.machinePool" [formControl]="form.controls.machinePool" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.machinePool.valid && form.controls.machinePool.dirty">
            <i class="fa fa-close"></i> Machine Pool is required
          </div>
        </div>
      </div>      
  `
})
export class ServerAssetPropertiesComponent implements OnInit {
  @Input()
  public model: ServerAsset;
  @Input()
  public formContainer: FormGroup[];

  public form: FormGroup;

  public binder: DataCenterBinder;

  constructor(private containersService: ContainersService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.binder = new DataCenterBinder(this.containersService, this.model);
    this.form = this.formBuilder.group({
      dataCenter: ['', Validators.required],
      domain: ['', Validators.required],
      ip: ['', Validators.required],
      ipInternal: ['', Validators.required],
      odsId: ['', Validators.required],
      odsVersion: ['', Validators.required],
      machinePool: ['', Validators.required],
    });
    this.formContainer.push(this.form);
  }
}
