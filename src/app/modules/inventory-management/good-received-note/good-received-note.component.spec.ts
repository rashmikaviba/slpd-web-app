import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodReceivedNoteComponent } from './good-received-note.component';

describe('GoodReceivedNoteComponent', () => {
  let component: GoodReceivedNoteComponent;
  let fixture: ComponentFixture<GoodReceivedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodReceivedNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
