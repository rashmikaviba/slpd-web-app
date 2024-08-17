/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MonthAuditComponent } from './month-audit.component';

describe('MonthAuditComponent', () => {
  let component: MonthAuditComponent;
  let fixture: ComponentFixture<MonthAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
