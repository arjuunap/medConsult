import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthVital } from './health-vital';

describe('HealthVital', () => {
  let component: HealthVital;
  let fixture: ComponentFixture<HealthVital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthVital],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthVital);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
