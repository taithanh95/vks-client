import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDocumentComponent } from './compensation-document.component';

describe('CompensationDocumentComponent', () => {
  let component: CompensationDocumentComponent;
  let fixture: ComponentFixture<CompensationDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
