import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRoomList } from './case-room-list';

describe('CaseRoomList', () => {
  let component: CaseRoomList;
  let fixture: ComponentFixture<CaseRoomList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRoomList],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseRoomList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
