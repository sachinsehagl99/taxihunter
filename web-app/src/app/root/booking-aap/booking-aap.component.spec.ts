import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAapComponent } from './booking-aap.component';

describe('BookingAapComponent', () => {
  let component: BookingAapComponent;
  let fixture: ComponentFixture<BookingAapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
