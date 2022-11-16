import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationModalComponent } from './compensation-modal.component';

describe('CompensationModalComponent', () => {
  let component: CompensationModalComponent;
  let fixture: ComponentFixture<CompensationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
