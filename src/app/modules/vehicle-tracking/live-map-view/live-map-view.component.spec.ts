import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMapViewComponent } from './live-map-view.component';

describe('LiveMapViewComponent', () => {
  let component: LiveMapViewComponent;
  let fixture: ComponentFixture<LiveMapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMapViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
