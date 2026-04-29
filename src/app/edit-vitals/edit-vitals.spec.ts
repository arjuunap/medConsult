import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVitals } from './edit-vitals';

describe('EditVitals', () => {
  let component: EditVitals;
  let fixture: ComponentFixture<EditVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVitals],
    }).compileComponents();

    fixture = TestBed.createComponent(EditVitals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
