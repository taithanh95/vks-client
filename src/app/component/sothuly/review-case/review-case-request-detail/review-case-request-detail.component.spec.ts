import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseRequestDetailComponent} from './review-case-request-detail.component';

describe('ReviewCaseRequestDetailComponent', () => {
  let component: ReviewCaseRequestDetailComponent;
  let fixture: ComponentFixture<ReviewCaseRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseRequestDetailComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
