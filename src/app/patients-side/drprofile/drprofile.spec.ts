import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drprofile } from './drprofile';

describe('Drprofile', () => {
  let component: Drprofile;
  let fixture: ComponentFixture<Drprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drprofile],
    }).compileComponents();

    fixture = TestBed.createComponent(Drprofile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
