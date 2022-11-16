import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDamagesListComponent } from './compensation-damages-list.component';

describe('CompensationDamagesListComponent', () => {
  let component: CompensationDamagesListComponent;
  let fixture: ComponentFixture<CompensationDamagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationDamagesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDamagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
