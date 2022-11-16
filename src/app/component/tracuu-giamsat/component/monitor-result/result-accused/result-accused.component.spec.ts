import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAccusedComponent } from './result-accused.component';

describe('ResultAccusedComponent', () => {
  let component: ResultAccusedComponent;
  let fixture: ComponentFixture<ResultAccusedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultAccusedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultAccusedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
