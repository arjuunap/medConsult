import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addschedule } from './addschedule';

describe('Addschedule', () => {
  let component: Addschedule;
  let fixture: ComponentFixture<Addschedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addschedule],
    }).compileComponents();

    fixture = TestBed.createComponent(Addschedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
