import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultForm } from './lab-result-form';

describe('LabResultForm', () => {
  let component: LabResultForm;
  let fixture: ComponentFixture<LabResultForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabResultForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResultForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
