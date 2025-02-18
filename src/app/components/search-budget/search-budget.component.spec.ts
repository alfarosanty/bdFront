import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBudgetComponent } from './search-budget.component';

describe('SearchBudgetComponent', () => {
  let component: SearchBudgetComponent;
  let fixture: ComponentFixture<SearchBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBudgetComponent]
    });
    fixture = TestBed.createComponent(SearchBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
