import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripManagementFormComponent } from './trip-management-form.component';

describe('TripManagementFormComponent', () => {
  let component: TripManagementFormComponent;
  let fixture: ComponentFixture<TripManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripManagementFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
