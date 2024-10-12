import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripInformationsComponent } from './trip-informations.component';

describe('TripInformationsComponent', () => {
  let component: TripInformationsComponent;
  let fixture: ComponentFixture<TripInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
