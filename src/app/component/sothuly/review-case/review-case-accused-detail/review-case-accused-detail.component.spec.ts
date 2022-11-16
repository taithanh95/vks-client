import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseAccusedDetailComponent} from './review-case-accused-detail.component';

describe('ReviewCaseAccusedDetailComponent', () => {
  let component: ReviewCaseAccusedDetailComponent;
  let fixture: ComponentFixture<ReviewCaseAccusedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewCaseAccusedDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseAccusedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
