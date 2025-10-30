/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TripManagementByDriverAssistantComponent } from './trip-management-by-driver-assistant.component';

describe('TripManagementByDriverAssistantComponent', () => {
  let component: TripManagementByDriverAssistantComponent;
  let fixture: ComponentFixture<TripManagementByDriverAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripManagementByDriverAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripManagementByDriverAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
