import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkmodeButton } from './darkmode-button';

describe('DarkmodeButton', () => {
  let component: DarkmodeButton;
  let fixture: ComponentFixture<DarkmodeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkmodeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkmodeButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
