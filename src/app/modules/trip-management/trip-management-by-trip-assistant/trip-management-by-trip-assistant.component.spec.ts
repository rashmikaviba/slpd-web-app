/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TripManagementByTripAssistantComponent } from './trip-management-by-trip-assistant.component';

describe('TripManagementByTripAssistantComponent', () => {
  let component: TripManagementByTripAssistantComponent;
  let fixture: ComponentFixture<TripManagementByTripAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripManagementByTripAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripManagementByTripAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
