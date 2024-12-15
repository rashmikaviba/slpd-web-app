import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseManagementFormComponent } from './expense-management-form.component';

describe('ExpenseManagementFormComponent', () => {
  let component: ExpenseManagementFormComponent;
  let fixture: ComponentFixture<ExpenseManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseManagementFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
