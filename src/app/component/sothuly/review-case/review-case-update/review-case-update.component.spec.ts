import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseUpdateComponent} from './review-case-update.component';

describe('ReviewCaseUpdateComponent', () => {
  let component: ReviewCaseUpdateComponent;
  let fixture: ComponentFixture<ReviewCaseUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseUpdateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
