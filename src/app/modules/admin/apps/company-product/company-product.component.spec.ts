import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProductComponent } from './company-product.component';

describe('InventoryComponent', () => {
  let component: CompanyProductComponent;
  let fixture: ComponentFixture<CompanyProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyProductComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
