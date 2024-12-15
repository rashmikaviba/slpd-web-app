import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLeaveFormComponent } from './driver-leave-form.component';

describe('DriverLeaveFormComponent', () => {
  let component: DriverLeaveFormComponent;
  let fixture: ComponentFixture<DriverLeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverLeaveFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverLeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
