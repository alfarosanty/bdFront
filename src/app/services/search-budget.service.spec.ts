import { TestBed } from '@angular/core/testing';

import { SearchBudgetService } from './search-budget.service';

describe('SearchBudgetService', () => {
  let service: SearchBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
