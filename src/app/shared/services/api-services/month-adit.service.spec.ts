/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MonthAditService } from './month-adit.service';

describe('Service: MonthAdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthAditService]
    });
  });

  it('should ...', inject([MonthAditService], (service: MonthAditService) => {
    expect(service).toBeTruthy();
  }));
});
