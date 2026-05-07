import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Labresultlist } from './labresultlist';

describe('Labresultlist', () => {
  let component: Labresultlist;
  let fixture: ComponentFixture<Labresultlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Labresultlist],
    }).compileComponents();

    fixture = TestBed.createComponent(Labresultlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
