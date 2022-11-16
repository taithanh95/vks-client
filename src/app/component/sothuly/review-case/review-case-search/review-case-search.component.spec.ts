import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseSearchComponent} from './review-case-search.component';

describe('ReviewCaseSearchComponent', () => {
  let component: ReviewCaseSearchComponent;
  let fixture: ComponentFixture<ReviewCaseSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseSearchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
