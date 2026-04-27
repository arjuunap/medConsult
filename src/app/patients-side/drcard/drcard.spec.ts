import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drcard } from './drcard';

describe('Drcard', () => {
  let component: Drcard;
  let fixture: ComponentFixture<Drcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drcard],
    }).compileComponents();

    fixture = TestBed.createComponent(Drcard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
