import { Component, Input, OnInit } from '@angular/core';
import { Server } from '../containers.types';
import { ContainersService } from '../containers.service';
import { DataCenterBinder } from './DataCenter.binder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sn-server-properties-component',
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
          Public Host *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.publicHost" [formControl]="form.controls.publicHost" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.publicHost.valid && form.controls.publicHost.dirty">
            <i class="fa fa-close"></i> Public Host is required
          </div>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Private Host *:
        </div>
        <div class="ui-g-4">
          <input pInputText [ngModel]="model.privateHost" [formControl]="form.controls.privateHost" placeholder="Required"/>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.privateHost.valid && form.controls.privateHost.dirty">
            <i class="fa fa-close"></i> Private Host is required
          </div>
        </div>
      </div>
  `
})
export class ServerPropertiesComponent implements OnInit {
  @Input()
  public model: Server;
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
      publicHost: ['', Validators.required],
      privateHost: ['', Validators.required]
    });
    this.formContainer.push(this.form);
  }
}
