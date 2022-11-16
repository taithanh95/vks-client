import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultTransferComponent } from './result-transfer.component';

describe('ResultTransferComponent', () => {
  let component: ResultTransferComponent;
  let fixture: ComponentFixture<ResultTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
