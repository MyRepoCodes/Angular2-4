import { Component, Input, OnInit } from '@angular/core';
import { JobHandlerType, JobHandler, Container } from '../containers.types';
import { DataCenterBinder, ServerBinder } from './DataCenter.binder';
import { ContainersService } from '../containers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sn-job-handler-properties-component',
  template: `
       <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Data Center *:
        </div>
        <div class="ui-g-4">
          <p-dropdown [options]="dataCenterBinder.dataCenters" [ngModel]="selectedDataCenter"
                      [style]="{'width':'168px'}" (onChange)="dataCenterChanged($event)" ></p-dropdown>
        </div>
      </div>
      
      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Server *:
        </div>
        <div class="ui-g-4">
          <p-dropdown [options]="serverBinder.servers" [ngModel]="serverBinder.server"
           [formControl]="form.controls.server" [style]="{'width':'168px'}"></p-dropdown>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.server.valid && form.controls.server.dirty">
            <i class="fa fa-close"></i> Server is required
          </div>
        </div>
      </div>

      <div class="ui-g-12 ui-g-nopad">
        <div class="ui-g-3">
          Job Type *:
        </div>
        <div class="ui-g-4">
          <p-dropdown [options]="types" [ngModel]="model.jobType"
          [formControl]="form.controls.jobType" [style]="{'width':'168px'}"></p-dropdown>
        </div>
        <div class="ui-g-5">
          <div class="ui-message ui-messages-error ui-corner-all"
               *ngIf="!form.controls.jobType.valid && form.controls.jobType.dirty">
            <i class="fa fa-close"></i> Job Type is required
          </div>
        </div>
      </div>
  `
})
export class JobHandlerPropertiesComponent implements OnInit {
  @Input()
  public model: JobHandler;
  @Input()
  public formContainer: FormGroup[];

  public form: FormGroup;

  public types;

  public selectedDataCenter;

  public dataCenterBinder: DataCenterBinder;

  public serverBinder: ServerBinder;

  constructor(private containersService: ContainersService, private formBuilder: FormBuilder) {
    this.types = [
      { label: 'Select Type', value: '' },
      { label: 'DVD Encoding', value: JobHandlerType.dvdEncoding },
      { label: 'TV Encoding', value: JobHandlerType.tvEncoding }
    ];
  }

  public dataCenterChanged(event) {
    this.serverBinder.dataCenter = event.value;
  }

  ngOnInit(): void {
    this.serverBinder = new ServerBinder(this.containersService, this.model);
    this.dataCenterBinder = new DataCenterBinder(this.containersService, {} as Container);
    this.selectedDataCenter = this.serverBinder.dataCenter;
    this.form = this.formBuilder.group({
      server: ['', Validators.required],
      jobType: ['', Validators.required]
    });
    this.formContainer.push(this.form);
  }
}
