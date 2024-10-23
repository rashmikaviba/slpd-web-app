import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripManagementPrintComponent } from './trip-management-print.component';

describe('TripManagementPrintComponent', () => {
  let component: TripManagementPrintComponent;
  let fixture: ComponentFixture<TripManagementPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripManagementPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripManagementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
