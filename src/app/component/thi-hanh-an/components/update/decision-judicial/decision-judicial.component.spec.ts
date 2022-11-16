import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionJudicialComponent } from './decision-judicial.component';

describe('DecisionJudicialComponent', () => {
  let component: DecisionJudicialComponent;
  let fixture: ComponentFixture<DecisionJudicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionJudicialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
