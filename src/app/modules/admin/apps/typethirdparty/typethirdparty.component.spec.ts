import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeThirdPartyComponent } from './typethirdparty.component';

describe('TypeThirdPartyComponent', () => {
  let component: TypeThirdPartyComponent;
  let fixture: ComponentFixture<TypeThirdPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeThirdPartyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
