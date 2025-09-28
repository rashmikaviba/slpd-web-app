/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QrInfoComponent } from './qr-info.component';

describe('QrInfoComponent', () => {
  let component: QrInfoComponent;
  let fixture: ComponentFixture<QrInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
