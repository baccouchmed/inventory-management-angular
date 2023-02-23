import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierClientComponent } from './supplier-client.component';

describe('CompaniesComponent', () => {
  let component: SupplierClientComponent;
  let fixture: ComponentFixture<SupplierClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierClientComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
