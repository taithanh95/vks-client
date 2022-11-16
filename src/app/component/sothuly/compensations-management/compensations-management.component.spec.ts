import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationsManagementComponent } from './compensations-management.component';

describe('CompensationsManagementComponent', () => {
  let component: CompensationsManagementComponent;
  let fixture: ComponentFixture<CompensationsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
