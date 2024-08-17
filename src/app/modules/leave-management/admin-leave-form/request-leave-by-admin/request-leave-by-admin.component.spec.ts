import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLeaveByAdminComponent } from './request-leave-by-admin.component';

describe('RequestLeaveByAdminComponent', () => {
  let component: RequestLeaveByAdminComponent;
  let fixture: ComponentFixture<RequestLeaveByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLeaveByAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLeaveByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
