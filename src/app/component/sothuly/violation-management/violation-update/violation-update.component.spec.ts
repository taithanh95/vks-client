import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationUpdateComponent } from './violation-update.component';

describe('ViolationUpdateComponent', () => {
  let component: ViolationUpdateComponent;
  let fixture: ComponentFixture<ViolationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
