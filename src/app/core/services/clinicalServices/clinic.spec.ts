import { TestBed } from '@angular/core/testing';

import { Clinic } from './clinic';

describe('Clinic', () => {
  let service: Clinic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Clinic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
