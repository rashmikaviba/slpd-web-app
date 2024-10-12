import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripManagementByDriverComponent } from './trip-management-by-driver.component';

describe('TripManagementByDriverComponent', () => {
  let component: TripManagementByDriverComponent;
  let fixture: ComponentFixture<TripManagementByDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripManagementByDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripManagementByDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
