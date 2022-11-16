import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationResultListComponent } from './violation-result-list.component';

describe('ViolationResultListComponent', () => {
  let component: ViolationResultListComponent;
  let fixture: ComponentFixture<ViolationResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationResultListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
