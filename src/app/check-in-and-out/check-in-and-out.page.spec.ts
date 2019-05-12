import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInAndOutPage } from './check-in-and-out.page';

describe('CheckInAndOutPage', () => {
  let component: CheckInAndOutPage;
  let fixture: ComponentFixture<CheckInAndOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInAndOutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInAndOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
