/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MonthlyVehiclePaymentMaintenanceReportComponent } from './monthly-vehicle-payment-maintenance-report.component';

describe('MonthlyVehiclePaymentMaintenanceReportComponent', () => {
  let component: MonthlyVehiclePaymentMaintenanceReportComponent;
  let fixture: ComponentFixture<MonthlyVehiclePaymentMaintenanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyVehiclePaymentMaintenanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyVehiclePaymentMaintenanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
