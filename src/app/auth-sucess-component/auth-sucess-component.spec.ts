import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSucessComponent } from './auth-sucess-component';

describe('AuthSucessComponent', () => {
  let component: AuthSucessComponent;
  let fixture: ComponentFixture<AuthSucessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSucessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSucessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
