import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTaskFormComponent } from './driver-task-form.component';

describe('DriverTaskFormComponent', () => {
  let component: DriverTaskFormComponent;
  let fixture: ComponentFixture<DriverTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverTaskFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
