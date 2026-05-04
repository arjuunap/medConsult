import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alllabresults } from './alllabresults';

describe('Alllabresults', () => {
  let component: Alllabresults;
  let fixture: ComponentFixture<Alllabresults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alllabresults],
    }).compileComponents();

    fixture = TestBed.createComponent(Alllabresults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
