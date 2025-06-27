/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MonthlyExpensesService } from './monthly-expenses.service';

describe('Service: MonthlyExpenses', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthlyExpensesService]
    });
  });

  it('should ...', inject([MonthlyExpensesService], (service: MonthlyExpensesService) => {
    expect(service).toBeTruthy();
  }));
});
