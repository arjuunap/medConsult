import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drschedul } from './drschedul';

describe('Drschedul', () => {
  let component: Drschedul;
  let fixture: ComponentFixture<Drschedul>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drschedul],
    }).compileComponents();

    fixture = TestBed.createComponent(Drschedul);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
