import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrSchedules } from './dr-schedules';

describe('DrSchedules', () => {
  let component: DrSchedules;
  let fixture: ComponentFixture<DrSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrSchedules],
    }).compileComponents();

    fixture = TestBed.createComponent(DrSchedules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
