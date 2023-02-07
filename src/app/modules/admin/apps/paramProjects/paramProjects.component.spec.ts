import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamProjectsComponent } from './paramProjects.component';

describe('GroupsComponent', () => {
  let component: ParamProjectsComponent;
  let fixture: ComponentFixture<ParamProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParamProjectsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
