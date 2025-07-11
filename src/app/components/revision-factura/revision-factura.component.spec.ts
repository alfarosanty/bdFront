import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionFacturaComponent } from './revision-factura.component';

describe('RevisionFacturaComponent', () => {
  let component: RevisionFacturaComponent;
  let fixture: ComponentFixture<RevisionFacturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionFacturaComponent]
    });
    fixture = TestBed.createComponent(RevisionFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
