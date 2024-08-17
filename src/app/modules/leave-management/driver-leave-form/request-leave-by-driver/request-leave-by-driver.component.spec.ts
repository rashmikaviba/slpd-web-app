import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLeaveByDriverComponent } from './request-leave-by-driver.component';

describe('RequestLeaveByDriverComponent', () => {
  let component: RequestLeaveByDriverComponent;
  let fixture: ComponentFixture<RequestLeaveByDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLeaveByDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLeaveByDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
