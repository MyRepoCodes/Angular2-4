import { Container, ContainerType } from './containers.types';
import { Component, Output, EventEmitter } from '@angular/core';
import { ContainersService } from './containers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataCenterBinder, ServerBinder } from './dialogs/DataCenter.binder';
export enum EditMode {
  create,
  edit
}

@Component({
  selector: 'sn-container-dialog-component',
  template: `
    <form (ngSubmit)="onSubmit(form.value)">
      <p-dialog [(visible)]="isVisible" modal="modal" showEffect="fade" header="{{title}}"
              [width]="600" (onAfterHide)="dialogClosed($event)">              
      <div class="ui-g">
      
        <div class="ui-g-12 ui-g-nopad">
          <div class="ui-g-3">
            Name *:
          </div>
          <div class="ui-g-4">
            <input pInputText [ngModel]="model.name" [formControl]="form.controls.name" placeholder="Required"/>
          </div>
          <div class="ui-g-5">
            <div class="ui-message ui-messages-error ui-corner-all"
                 *ngIf="!form.controls.name.valid && form.controls.name.dirty">
              <i class="fa fa-close"></i> Container Name is required
            </div>
          </div>
        </div>
      
        <div class="ui-g-12">
          <p-checkbox name="enabledCbx" label="Container Enabled" [(ngModel)]="model.enabled" binary="true">
          </p-checkbox>
        </div>

        <div class="ui-g-12">
          <p-checkbox name="activeCbx" label="Container Actived" [(ngModel)]="model.active" binary="true"></p-checkbox>
        </div>

        <sn-server-properties-component *ngIf="type === types.Server" [model]="model"
         [formContainer]="childForms"></sn-server-properties-component>
        <sn-job-handler-properties-component *ngIf="type === types.JobHandler"
         [model]="model" [formContainer]="childForms"></sn-job-handler-properties-component>
        <sn-data-center-properties-component *ngIf="type === types.DataCenter"
         [model]="model" [formContainer]="childForms"></sn-data-center-properties-component>
        <sn-stb-device-properties-component *ngIf="type === types.StbDevice"
         [model]="model" [formContainer]="childForms"></sn-stb-device-properties-component>
        <sn-server-asset-properties-component *ngIf="type === types.ServerAsset"
         [model]="model" [formContainer]="childForms"></sn-server-asset-properties-component>
      </div>
        <p-footer>
          <div class="ui-g-12">
            <div class="ui-g-6">
              <button type="submit" pButton icon="fa-check" label="Save" [disabled]="!isValid()"></button>
            </div>
            <div class="ui-g-6" *ngIf="mode === modes.edit">
              <button type="button" pButton icon="fa-close" label="Delete" (click)="delete()">
              </button>
            </div>
          </div>
        </p-footer>
      </p-dialog>
      </form>
  `
})
export class ContainerDialogComponent {
  @Output()
  public onSave = new EventEmitter(false);
  @Output()
  public onDelete = new EventEmitter(false);

  public mode: EditMode;
  public modes: any = EditMode;

  public model: Container = {} as Container;

  public type: ContainerType;
  public types: any = ContainerType;

  public isVisible = false;

  public form: FormGroup;
  public childForms: FormGroup[];

  public get title () {
    return this.mode === EditMode.create ? 'Create ' + this.typeDescription : 'Edit ' + this.typeDescription;
  }

  constructor(private containersService: ContainersService, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', Validators.required]
    });
    this.childForms = [];
  }

  public showDialog(container: Container, mode: EditMode): void {
    this.mode = mode;

    this.type = this.containersService.getType(container);
    this.model = container;
    this.isVisible = true;
  }

  private save() {
    this.onSave.emit({model: this.model, mode: this.mode});
    this.isVisible = false;
  }

  public delete() {
    this.onDelete.emit({model: this.model});
    this.isVisible = false;
  }

  public dialogClosed(v) {
    this.childForms.length = 0;
    this.type = ContainerType.Unknown; // we need this line to be sure that OnInit of child control will be called
    this.form.reset({name: this.model.name});
  }

  public onSubmit(v) {
    for (const child of this.childForms) {
      for (const name in child.value) {
        if (child.value.hasOwnProperty(name)) {
          if (name === DataCenterBinder.KEY_NAME || name === ServerBinder.KEY_NAME) {
            this.model.parent.id = child.value[name];
          } else {
            this.model[name] = child.value[name];
          }
        }
      }
    }
    for (const name in this.form.value) {
      if (this.form.value.hasOwnProperty(name)) {
        this.model[name] = this.form.value[name];
      }
    }
    this.childForms.length = 0;
    this.save();
  }

  public isValid() {
    if (this.childForms.length === 0) {
      return false;
    }
    for (const childForm of this.childForms) {
      if (!childForm.valid) {
        return false;
      }
    }
    return this.form.valid;
  }

  private get typeDescription () {
    switch (this.type) {
      case ContainerType.DataCenter:
        return 'Data Center';
      case ContainerType.Server:
        return 'Server';
      case ContainerType.JobHandler:
        return 'Job Handler';
      case ContainerType.StbDevice:
        return 'Stb Device';
      case ContainerType.ServerAsset:
        return 'Server Asset';
    }
    return 'Unknown container';
  }
}
