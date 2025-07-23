/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TripEndPosAuditComponent } from './trip-end-pos-audit.component';

describe('TripEndPosAuditComponent', () => {
  let component: TripEndPosAuditComponent;
  let fixture: ComponentFixture<TripEndPosAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripEndPosAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEndPosAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
