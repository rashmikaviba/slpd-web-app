import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeaveFormComponent } from './admin-leave-form.component';

describe('AdminLeaveFormComponent', () => {
  let component: AdminLeaveFormComponent;
  let fixture: ComponentFixture<AdminLeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLeaveFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
