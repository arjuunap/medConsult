import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVitals } from './show-vitals';

describe('ShowVitals', () => {
  let component: ShowVitals;
  let fixture: ComponentFixture<ShowVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVitals],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVitals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
