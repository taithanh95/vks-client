import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDamagesDetailComponent } from './compensation-damages-detail.component';

describe('CompensationDamagesDetailComponent', () => {
  let component: CompensationDamagesDetailComponent;
  let fixture: ComponentFixture<CompensationDamagesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationDamagesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDamagesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
