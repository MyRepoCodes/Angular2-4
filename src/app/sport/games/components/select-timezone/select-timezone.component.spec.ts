/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';

import { SelectTimezoneComponent } from './select-timezone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SelectTimezoneComponent', () => {
  let component: SelectTimezoneComponent;
  let fixture: ComponentFixture<SelectTimezoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTimezoneComponent],
      imports: [FormsModule, ReactiveFormsModule, DropdownModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
