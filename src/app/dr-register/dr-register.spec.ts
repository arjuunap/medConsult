import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrRegister } from './dr-register';

describe('DrRegister', () => {
  let component: DrRegister;
  let fixture: ComponentFixture<DrRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(DrRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
