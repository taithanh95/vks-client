import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationResultDetailComponent } from './violation-result-detail.component';

describe('ViolationResultDetailComponent', () => {
  let component: ViolationResultDetailComponent;
  let fixture: ComponentFixture<ViolationResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationResultDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
