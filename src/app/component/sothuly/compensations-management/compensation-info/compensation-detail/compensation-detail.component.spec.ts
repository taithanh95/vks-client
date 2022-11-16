import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDetailComponent } from './compensation-detail.component';

describe('CompensationDetailComponent', () => {
  let component: CompensationDetailComponent;
  let fixture: ComponentFixture<CompensationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
