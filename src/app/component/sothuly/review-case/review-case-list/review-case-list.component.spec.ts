import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseListComponent} from './review-case-list.component';

describe('ReviewCaseListComponent', () => {
  let component: ReviewCaseListComponent;
  let fixture: ComponentFixture<ReviewCaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewCaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
