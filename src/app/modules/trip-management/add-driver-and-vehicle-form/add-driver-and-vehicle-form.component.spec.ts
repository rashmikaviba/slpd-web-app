import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverAndVehicleFormComponent } from './add-driver-and-vehicle-form.component';

describe('AddDriverAndVehicleFormComponent', () => {
  let component: AddDriverAndVehicleFormComponent;
  let fixture: ComponentFixture<AddDriverAndVehicleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDriverAndVehicleFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDriverAndVehicleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
