import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductComponent } from './deduct.component';

describe('ListComponent', () => {
  let component: DeductComponent;
  let fixture: ComponentFixture<DeductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeductComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
