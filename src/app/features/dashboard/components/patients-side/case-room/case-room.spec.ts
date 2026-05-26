import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRoom } from './case-room';

describe('CaseRoom', () => {
  let component: CaseRoom;
  let fixture: ComponentFixture<CaseRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
