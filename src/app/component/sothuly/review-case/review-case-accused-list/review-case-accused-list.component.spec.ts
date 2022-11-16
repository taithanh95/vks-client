import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseAccusedListComponent} from './review-case-accused-list.component';

describe('ReviewCaseAccusedListComponent', () => {
  let component: ReviewCaseAccusedListComponent;
  let fixture: ComponentFixture<ReviewCaseAccusedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseAccusedListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseAccusedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
