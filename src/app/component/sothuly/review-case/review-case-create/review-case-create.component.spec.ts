import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewCaseCreateComponent} from './review-case-create.component';

describe('ReviewCaseCreateComponent', () => {
  let component: ReviewCaseCreateComponent;
  let fixture: ComponentFixture<ReviewCaseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCaseCreateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
