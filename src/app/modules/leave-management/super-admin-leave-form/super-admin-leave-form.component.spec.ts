import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminLeaveFormComponent } from './super-admin-leave-form.component';

describe('SuperAdminLeaveFormComponent', () => {
  let component: SuperAdminLeaveFormComponent;
  let fixture: ComponentFixture<SuperAdminLeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminLeaveFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminLeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
