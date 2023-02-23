import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDateComponent } from './event-date.component';

describe('EventDateComponent', () => {
  let component: EventDateComponent;
  let fixture: ComponentFixture<EventDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
