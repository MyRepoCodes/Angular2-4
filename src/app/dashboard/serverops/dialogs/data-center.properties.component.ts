import { Component, Input, OnInit } from '@angular/core';
import { DataCenter } from '../containers.types';
import { NotificationService } from '../../../shared/services/notification.service';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'sn-data-center-properties-component',
  template: `
    <p-fieldset legend="Subnets">
      <p-dataList emptyMessage="No subnets for this data center" [value]="subnets">
        <ng-template let-data let-row="index" pTemplate="item">
          <div class="ui-g">
            <div class="ui-g-6">{{data}}</div>
            <div class="ui-g-3">
              <button type="button" pButton icon="fa-close" label="Delete" (click)="removeSubnet(data)"></button>
            </div>            
          </div>
        </ng-template>
      </p-dataList>
      <input placeholder="Subnet mask" type="text" pInputText [(ngModel)]="subnetName" />
      <button type="button" pButton icon="fa-check" label="Add subnet" (click)="addSubnet()" ></button>
    </p-fieldset>
  `
})
export class DataCenterPropertiesComponent implements OnInit {
  @Input()
  public model: DataCenter;
  @Input()
  public formContainer: FormGroup[];

  public form: FormGroup;

  public subnetName: string;

  public subnets: string[];

  constructor(private notificationService: NotificationService, private formBuilder: FormBuilder) {

  }

  public addSubnet() {
    const index = this.subnets.indexOf(this.subnetName);
    if (index >= 0) {
      this.notificationService.showWarn('Subnet ' + this.subnetName + ' already exists');
    } else {
      this.subnets.push(this.subnetName);
    }
    this.subnetName = '';
    this.form.setValue({subnets: this.subnets});
    this.form.updateValueAndValidity();
  }

  public removeSubnet(item: string) {
    const index = this.subnets.indexOf(item);
    this.subnets.splice(index, 1);
    this.form.setValue({subnets: this.subnets});
    this.form.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      subnets: ['', this.validate()]
    });
    this.formContainer.push(this.form);
    if (this.model.subnets) {
      this.subnets = JSON.parse(JSON.stringify(this.model.subnets));
    } else {
      this.subnets = [];
    }
  }

  private validate(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (control.value && control.value.length > 0) {
        return null;
      }
      return {
        'subnets': 'Add subnets'
      };
    };
  }
}
