import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultVerifyComponent } from './result-verify.component';

describe('ResultVerifyComponent', () => {
  let component: ResultVerifyComponent;
  let fixture: ComponentFixture<ResultVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
