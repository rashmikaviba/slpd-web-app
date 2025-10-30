/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VehicleMaintenanceInvoiceComponent } from './vehicle-maintenance-invoice.component';

describe('VehicleMaintenanceInvoiceComponent', () => {
  let component: VehicleMaintenanceInvoiceComponent;
  let fixture: ComponentFixture<VehicleMaintenanceInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleMaintenanceInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMaintenanceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
