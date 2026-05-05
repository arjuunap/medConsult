import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schedul } from './schedul';

describe('Schedul', () => {
  let component: Schedul;
  let fixture: ComponentFixture<Schedul>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Schedul],
    }).compileComponents();

    fixture = TestBed.createComponent(Schedul);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
