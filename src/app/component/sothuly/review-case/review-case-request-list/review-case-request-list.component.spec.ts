import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseRequestListComponent} from './review-case-request-list.component';

describe('ReviewCaseRequestListComponent', () => {
  let component: ReviewCaseRequestListComponent;
  let fixture: ComponentFixture<ReviewCaseRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseRequestListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
